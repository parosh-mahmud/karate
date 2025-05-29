import { createContext, useContext, useReducer } from "react";

const CartStateContext = createContext();
const CartDispatchContext = createContext();

const initialState = {
  items: [],
  itemCount: 0,
  total: 0,
};

function cartReducer(state, action) {
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.items.find(
        (item) => item.id === action.payload.id
      );

      if (existing) {
        // Check stock limit
        if (existing.quantity >= existing.stockQuantity) {
          return state;
        }

        const updatedItems = state.items.map((item) =>
          item.id === action.payload.id
            ? {
                ...item,
                quantity: Math.min(item.quantity + 1, item.stockQuantity),
              }
            : item
        );

        return calculateCartTotals({ ...state, items: updatedItems });
      }

      const newItems = [...state.items, { ...action.payload, quantity: 1 }];
      return calculateCartTotals({ ...state, items: newItems });
    }

    case "REMOVE_ITEM": {
      const updatedItems = state.items.filter(
        (item) => item.id !== action.payload
      );
      return calculateCartTotals({ ...state, items: updatedItems });
    }

    case "INCREASE_ITEM": {
      const updatedItems = state.items.map((item) =>
        item.id === action.payload
          ? {
              ...item,
              quantity: Math.min(item.quantity + 1, item.stockQuantity),
            }
          : item
      );
      return calculateCartTotals({ ...state, items: updatedItems });
    }

    case "DECREASE_ITEM": {
      const updatedItems = state.items.map((item) =>
        item.id === action.payload
          ? {
              ...item,
              quantity: Math.max(1, item.quantity - 1), // Ensure quantity doesn't go below 1
            }
          : item
      );
      return calculateCartTotals({ ...state, items: updatedItems });
    }

    case "UPDATE_QUANTITY": {
      const { id, quantity } = action.payload;
      const updatedItems = state.items.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: Math.max(1, Math.min(quantity, item.stockQuantity)),
            }
          : item
      );
      return calculateCartTotals({ ...state, items: updatedItems });
    }

    case "CLEAR_CART":
      return { ...initialState };

    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
}

// Helper function to calculate cart totals
function calculateCartTotals(state) {
  const itemCount = state.items.reduce(
    (total, item) => total + item.quantity,
    0
  );
  const total = state.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return {
    ...state,
    itemCount,
    total: Number(total.toFixed(2)),
  };
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  return (
    <CartDispatchContext.Provider value={dispatch}>
      <CartStateContext.Provider value={state}>
        {children}
      </CartStateContext.Provider>
    </CartDispatchContext.Provider>
  );
}

export function useCartState() {
  const context = useContext(CartStateContext);
  if (context === undefined) {
    throw new Error("useCartState must be used within a CartProvider");
  }
  return context;
}

export function useCartDispatch() {
  const context = useContext(CartDispatchContext);
  if (context === undefined) {
    throw new Error("useCartDispatch must be used within a CartProvider");
  }
  return context;
}

// Custom hook to access both state and dispatch
export function useCart() {
  return {
    cart: useCartState(),
    dispatch: useCartDispatch(),
  };
}
