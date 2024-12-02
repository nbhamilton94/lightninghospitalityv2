/**
 * Mock for lightning/navigation module
 */

// Create a Jest mock function
const Navigate = jest.fn();

export const NavigationMixin = (Base) => {
    return class extends Base {
        Navigate = Navigate;
    }
};

// Create a string-based key instead of a Symbol
NavigationMixin.Navigate = 'Navigate';

// Export the mocked navigation function
export { Navigate };
