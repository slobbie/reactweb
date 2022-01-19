import React from 'react';
import { useCallback, useMemo, useReducer, useRef } from 'react';
import CreateUser from './CreateUser';
import useInputs from './hooks/useInputs';
import MarginTop from './MarginTop';
import UserList2 from './UserList2';

const countActiveUsers = (users: any) => {
  console.log('활성 사용자 수를 세는중...');
  return users.filter((user: any) => user.active).length; //active 값이 true 인 사용자의 수를 체크
};

const initialState = {
  users: [
    {
      id: 1,
      username: 'velopert',
      email: 'public.velopert@gmail.com',
      active: true,
    },
    {
      id: 2,
      username: 'tester',
      email: 'tester@example.com',
      active: false,
    },
    {
      id: 3,
      username: 'liz',
      email: 'liz@example.com',
      active: false,
    },
  ],
};

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case 'CREATE_USER':
      return {
        users: state.users.concat(action.user),
      };
    case 'TOGGLE_USER':
      return {
        ...state,
        users: state.users.map((user: any) =>
          user.id === action.id ? { ...user, active: !user.active } : user
        ),
      };
    case 'REMOVE_USER':
      return {
        ...state,
        users: state.users.filter((user: any) => user.id !== action.id),
      };
    default:
      return state;
  }
};

// UserDispatch 라는 이름으로 내보내줌.
export const UserDispatch = React.createContext<any>(null);

const Page3 = () => {
  const [{ username, email }, onChange, reset] = useInputs({
    username: '',
    email: '',
  });
  const [state, dispatch] = useReducer(reducer, initialState);
  const nextId = useRef(4);

  const { users } = state;

  const onCreate = useCallback(() => {
    dispatch({
      type: 'CREATE_USER',
      user: {
        id: nextId.current,
        username,
        email,
      },
    });
    reset();
    nextId.current += 1;
  }, [username, email, reset]);

  const count = useMemo(() => countActiveUsers(users), [users]);
  return (
    <UserDispatch.Provider value={dispatch}>
      <div className='page'>
        <div className='pageBox'>
          <MarginTop margin={50} />
          <CreateUser
            username={username}
            email={email}
            onChange={onChange}
            onCreate={onCreate}
          />
          <UserList2 users={users} />
          {/* context 를 사용해 전역으로 값을 보내주었기 때문에 컴포넌트에 props 를 보낼 이유가 없음 */}
          <div> 할성사용자 수 : {count}</div>
        </div>
      </div>
    </UserDispatch.Provider>
  );
};

export default Page3;
