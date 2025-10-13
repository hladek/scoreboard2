import { mount } from '@vue/test-utils';
import UserList from '@/components/UserList.vue';
import api from '@/api';

jest.mock('@/api');

describe('UserList.vue', () => {
  let wrapper;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
    }
  });

  it('renders user list table', async () => {
    const mockUsers = [
      {
        id: 1,
        username: 'admin',
        email: 'admin@example.com',
        is_admin: true
      },
      {
        id: 2,
        username: 'john',
        email: 'john@example.com',
        is_admin: false
      }
    ];

    api.getUsers.mockResolvedValue({
      data: { users: mockUsers }
    });

    wrapper = mount(UserList);
    await wrapper.vm.$nextTick();
    
    // Wait for promise to resolve
    await new Promise(resolve => setTimeout(resolve, 0));
    await wrapper.vm.$nextTick();

    expect(wrapper.find('[data-testid="user-table"]').exists()).toBe(true);
    expect(wrapper.findAll('[data-testid^="user-row-"]').length).toBe(2);
  });

  it('displays loading state', () => {
    api.getUsers.mockImplementation(() => new Promise(() => {})); // Never resolves

    wrapper = mount(UserList);

    expect(wrapper.find('.spinner-border').exists()).toBe(true);
  });

  it('displays error message on fetch failure', async () => {
    const errorMessage = 'Failed to load users';
    api.getUsers.mockRejectedValue({
      response: { data: { error: errorMessage } }
    });

    wrapper = mount(UserList);
    await wrapper.vm.$nextTick();
    
    // Wait for promise to resolve
    await new Promise(resolve => setTimeout(resolve, 0));
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain(errorMessage);
  });

  it('displays admin badge correctly', async () => {
    const mockUsers = [
      {
        id: 1,
        username: 'admin',
        email: 'admin@example.com',
        is_admin: true
      },
      {
        id: 2,
        username: 'john',
        email: 'john@example.com',
        is_admin: false
      }
    ];

    api.getUsers.mockResolvedValue({
      data: { users: mockUsers }
    });

    wrapper = mount(UserList);
    await wrapper.vm.$nextTick();
    
    // Wait for promise to resolve
    await new Promise(resolve => setTimeout(resolve, 0));
    await wrapper.vm.$nextTick();

    const badges = wrapper.findAll('.badge');
    expect(badges.length).toBe(2);
    expect(badges[0].classes()).toContain('bg-success');
    expect(badges[1].classes()).toContain('bg-secondary');
  });

  it('shows edit buttons when canEdit is true', async () => {
    const mockUsers = [
      {
        id: 1,
        username: 'admin',
        email: 'admin@example.com',
        is_admin: true
      }
    ];

    api.getUsers.mockResolvedValue({
      data: { users: mockUsers }
    });

    wrapper = mount(UserList, {
      props: {
        canEdit: true
      }
    });
    await wrapper.vm.$nextTick();
    
    // Wait for promise to resolve
    await new Promise(resolve => setTimeout(resolve, 0));
    await wrapper.vm.$nextTick();

    expect(wrapper.find('[data-testid="edit-user-1"]').exists()).toBe(true);
  });

  it('emits edit-user event when edit button is clicked', async () => {
    const mockUser = {
      id: 1,
      username: 'admin',
      email: 'admin@example.com',
      is_admin: true
    };

    api.getUsers.mockResolvedValue({
      data: { users: [mockUser] }
    });

    wrapper = mount(UserList, {
      props: {
        canEdit: true
      }
    });
    await wrapper.vm.$nextTick();
    
    // Wait for promise to resolve
    await new Promise(resolve => setTimeout(resolve, 0));
    await wrapper.vm.$nextTick();

    await wrapper.find('[data-testid="edit-user-1"]').trigger('click');

    expect(wrapper.emitted('edit-user')).toBeTruthy();
    expect(wrapper.emitted('edit-user')[0]).toEqual([mockUser]);
  });
});
