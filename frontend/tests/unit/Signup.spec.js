import { mount } from '@vue/test-utils';
import Signup from '@/components/Signup.vue';
import api from '@/api';

jest.mock('@/api');

describe('Signup.vue', () => {
  let wrapper;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
    }
    jest.useRealTimers();
  });

  it('renders signup form', () => {
    wrapper = mount(Signup, {
      global: {
        stubs: {
          'router-link': true
        }
      }
    });

    expect(wrapper.find('[data-testid="username-input"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="email-input"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="password-input"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="signup-button"]').exists()).toBe(true);
  });

  it('displays error message on signup failure', async () => {
    const errorMessage = 'Username already exists';
    api.signup.mockRejectedValue({
      response: { data: { error: errorMessage } }
    });

    wrapper = mount(Signup, {
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
    await wrapper.find('[data-testid="email-input"]').setValue('test@example.com');
    await wrapper.find('[data-testid="password-input"]').setValue('password123');
    await wrapper.find('form').trigger('submit.prevent');
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain(errorMessage);
  });

  it('successfully signs up and redirects to login', async () => {
    const mockResponse = {
      data: {
        message: 'User created successfully',
        user: {
          id: 4,
          username: 'newuser',
          email: 'newuser@example.com',
          is_admin: false
        }
      }
    };
    api.signup.mockResolvedValue(mockResponse);

    const mockRouter = {
      push: jest.fn()
    };

    wrapper = mount(Signup, {
      global: {
        stubs: {
          'router-link': true
        },
        mocks: {
          $router: mockRouter
        }
      }
    });

    await wrapper.find('[data-testid="username-input"]').setValue('newuser');
    await wrapper.find('[data-testid="email-input"]').setValue('newuser@example.com');
    await wrapper.find('[data-testid="password-input"]').setValue('password123');
    await wrapper.find('form').trigger('submit.prevent');
    await wrapper.vm.$nextTick();

    expect(api.signup).toHaveBeenCalledWith('newuser', 'newuser@example.com', 'password123');
    expect(wrapper.text()).toContain('Account created successfully');

    // Fast-forward time
    jest.advanceTimersByTime(2000);
    await wrapper.vm.$nextTick();

    expect(mockRouter.push).toHaveBeenCalledWith('/login');
  });

  it('displays loading state during signup', async () => {
    api.signup.mockImplementation(() => new Promise(() => {})); // Never resolves

    wrapper = mount(Signup, {
      global: {
        stubs: {
          'router-link': true
        }
      }
    });

    await wrapper.find('[data-testid="username-input"]').setValue('testuser');
    await wrapper.find('[data-testid="email-input"]').setValue('test@example.com');
    await wrapper.find('[data-testid="password-input"]').setValue('password123');
    await wrapper.find('form').trigger('submit.prevent');
    await wrapper.vm.$nextTick();

    expect(wrapper.find('[data-testid="signup-button"]').text()).toContain('Creating account...');
    expect(wrapper.find('[data-testid="signup-button"]').element.disabled).toBe(true);
  });
});
