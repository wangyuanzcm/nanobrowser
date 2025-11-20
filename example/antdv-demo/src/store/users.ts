import { reactive } from 'vue';

export type User = {
  id: number;
  name: string;
  email: string;
  city: string;
  birthDate: string;
};

const state = reactive<{ users: User[]; nextId: number }>({
  users: [
    { id: 1, name: '张三', email: 'zhangsan@example.com', city: '北京', birthDate: '1990-01-01' },
    { id: 2, name: '李四', email: 'lisi@example.com', city: '上海', birthDate: '1988-05-12' },
  ],
  nextId: 3,
});

export const usersStore = {
  list() {
    return state.users;
  },
  get(id: number) {
    return state.users.find(u => u.id === id) || null;
  },
  create(payload: Omit<User, 'id'>) {
    const user: User = { id: state.nextId++, ...payload };
    state.users.push(user);
    return user;
  },
  update(id: number, payload: Partial<Omit<User, 'id'>>) {
    const u = state.users.find(x => x.id === id);
    if (!u) return null;
    Object.assign(u, payload);
    return u;
  },
  remove(id: number) {
    const idx = state.users.findIndex(x => x.id === id);
    if (idx >= 0) state.users.splice(idx, 1);
  },
};
