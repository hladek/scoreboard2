import { mount } from '@vue/test-utils';
import Login from '@/components/Login.vue';
import api from '@/api';

jest.mock('@/api');

describe('Login.vue', () => {
  let wrapper;

  beforeEach(() => {
    // Clear localStorage
    localStorage.clear();
    // Reset mocks
    jest.clearAllMocks();
  });

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
    }
  });

  it('renders login form', () => {
    wrapper = mount(Login, {
      global: {
        stubs: {
          'router-link': true
        }
      }
    });

    expect(wrapper.find('[data-testid="username-input"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="password-input"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="login-button"]').exists()).toBe(true);
  });

  it('displays error message on login failure', async () => {
    const errorMessage = 'Invalid credentials';
    api.login.mockRejectedValue({
      response: { data: { error: errorMessage } }
    });

    wrapper = mount(Login, {
      global: {
        stubs: {
          'router-link': true
        },
        mocks: {
          $router: {
            push: jest.fn()
          }
        }
      }
    });

    await wrapper.find('[data-testid="username-input"]').setValue('testuser');
    await wrapper.find('[data-testid="password-input"]').setValue('wrongpassword');
    await wrapper.find('form').trigger('submit.prevent');
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain(errorMessage);
  });

  it('successfully logs in and redirects admin user', async () => {
    const mockResponse = {
      data: {
        token: 'test-token',
        user: {
          id: 1,
          username: 'admin',
          email: 'admin@example.com',
          is_admin: true
        }
      }
    };
    api.login.mockResolvedValue(mockResponse);

    const mockRouter = {
      push: jest.fn()
    };

    wrapper = mount(Login, {
      global: {
        stubs: {
          'router-link': true
        },
        mocks: {
          $router: mockRouter
        }
      }
    });

    await wrapper.find('[data-testid="username-input"]').setValue('admin');
    await wrapper.find('[data-testid="password-input"]').setValue('admin123');
    await wrapper.find('form').trigger('submit.prevent');
    await wrapper.vm.$nextTick();

    expect(api.login).toHaveBeenCalledWith('admin', 'admin123');
    expect(localStorage.getItem('token')).toBe('test-token');
    expect(JSON.parse(localStorage.getItem('user'))).toEqual(mockResponse.data.user);
    expect(mockRouter.push).toHaveBeenCalledWith('/admin');
  });

  it('successfully logs in and redirects regular user', async () => {
    const mockResponse = {
      data: {
        token: 'test-token',
        user: {
          id: 2,
          username: 'john',
          email: 'john@example.com',
          is_admin: false
        }
      }
    };
    api.login.mockResolvedValue(mockResponse);

    const mockRouter = {
      push: jest.fn()
    };

    wrapper = mount(Login, {
      global: {
        stubs: {
          'router-link': true
        },
        mocks: {
          $router: mockRouter
        }
      }
    });

    await wrapper.find('[data-testid="username-input"]').setValue('john');
    await wrapper.find('[data-testid="password-input"]').setValue('user123');
    await wrapper.find('form').trigger('submit.prevent');
    await wrapper.vm.$nextTick();

    expect(mockRouter.push).toHaveBeenCalledWith('/');
  });
});
