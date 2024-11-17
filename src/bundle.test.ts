import { expect, it, describe } from "vitest";
import productDiscounts from "./bundle-builder";

const eligibleProducts = [
  "gid://shopify/Product/Apple",
  "gid://shopify/Product/Banana",
  "gid://shopify/Product/Cherry",
  "gid://shopify/Product/Date",
  "gid://shopify/Product/Elderberry",
  "gid://shopify/Product/Fig",
  "gid://shopify/Product/Grape",
  "gid://shopify/Product/Honeydew",
  "gid://shopify/Product/Kiwi",
  "gid://shopify/Product/Lemon",
  "gid://shopify/Product/Mango",
  "gid://shopify/Product/Nectarine",
  "gid://shopify/Product/Orange",
  "gid://shopify/Product/Papaya",
  "gid://shopify/Product/Quince",
  "gid://shopify/Product/Raspberry",
  "gid://shopify/Product/Strawberry",
  "gid://shopify/Product/Tangerine",
  "gid://shopify/Product/Ugli",
  "gid://shopify/Product/Voavanga",
  "gid://shopify/Product/Watermelon",
  "gid://shopify/Product/Xigua",
  "gid://shopify/Product/Yuzu",
  "gid://shopify/Product/Zucchini",
  "gid://shopify/Product/Apricot",
  "gid://shopify/Product/Blackberry",
  "gid://shopify/Product/Coconut",
  "gid://shopify/Product/Durian",
  "gid://shopify/Product/Eggplant",
  "gid://shopify/Product/Feijoa",
  "gid://shopify/Product/Guava",
  "gid://shopify/Product/Huckleberry",
];
const mockProductDiscountDataWithPercentage = {
  cart: {
    buyerIdentity: null,
    lines: [
      {
        id: "gid://shopify/CartLine/0",
        quantity: 3,
        sellingPlanAllocation: null,
        cost: {
          amountPerQuantity: {
            amount: "10.95",
            currencyCode: "EUR",
          },
        },
        merchandise: {
          __typename: "ProductVariant",
          id: "gid://shopify/ProductVariant/39370591273049",
          product: {
            id: "gid://shopify/Product/Apple",
          },
        },
      },
      {
        id: "gid://shopify/CartLine/1",
        quantity: 3,
        sellingPlanAllocation: null,
        cost: {
          amountPerQuantity: {
            amount: "10.95",
            currencyCode: "EUR",
          },
        },
        merchandise: {
          __typename: "ProductVariant",
          id: "gid://shopify/ProductVariant/32385157005401",
          product: {
            id: "gid://shopify/Product/Banana",
          },
        },
      },
    ],
  },
  discountNode: {
    metafield: {
      value: JSON.stringify({
        id: "148",
        tiers: [
          { title: "3 FRUITS - 10% OFF", amount: 10, quantity: 3 },
          { title: "6 FRUITS - 17% OFF", amount: 17, quantity: 6 },
          { title: "9 FRUITS - 20% OFF", amount: 20, quantity: 9 },
        ],
        collections: [],
        products: eligibleProducts,
        discountType: "PERCENTAGE",
        title: "Chroma Bundle Builder",
        allowStackingWithSubscription: false,
      }),
    },
  },
} as any;

console.log(JSON.stringify(mockProductDiscountDataWithPercentage, null, 2));
const mockProductDiscountDataWithFixedAmount = {
  cart: {
    buyerIdentity: null,
    lines: [
      {
        id: "gid://shopify/CartLine/0",
        quantity: 3,
        sellingPlanAllocation: null,
        cost: {
          amountPerQuantity: {
            amount: "10.95",
            currencyCode: "EUR",
          },
        },
        merchandise: {
          __typename: "ProductVariant",
          id: "gid://shopify/ProductVariant/39370591273049",
          product: {
            id: "gid://shopify/Product/Apple",
          },
        },
      },
      {
        id: "gid://shopify/CartLine/1",
        quantity: 3,
        sellingPlanAllocation: null,
        cost: {
          amountPerQuantity: {
            amount: "10.95",
            currencyCode: "EUR",
          },
        },
        merchandise: {
          __typename: "ProductVariant",
          id: "gid://shopify/ProductVariant/32385157005401",
          product: {
            id: "gid://shopify/Product/Banana",
          },
        },
      },
    ],
  },
  discountNode: {
    metafield: {
      value: JSON.stringify({
        id: "148",
        tiers: [
          { title: "3 FRUITS - 10$ OFF", amount: 10, quantity: 3 },
          { title: "6 FRUITS - 17$ OFF", amount: 17, quantity: 6 },
          { title: "9 FRUITS - 20$ OFF", amount: 20, quantity: 9 },
        ],
        collections: [],
        products: eligibleProducts,
        discountType: "FIXED_AMOUNT",
        title: "Chroma Bundle Builder",
        allowStackingWithSubscription: false,
      }),
    },
  },
} as any;
describe("bundle builder v2", () => {
  it("should able to handle multiple discounts in percentage", () => {
    const result = productDiscounts(mockProductDiscountDataWithPercentage);

    expect(result.discounts.length).toBe(1);
  }),
    it("should able to handle multiple discounts in fixed amounts", () => {
      const result = productDiscounts(mockProductDiscountDataWithFixedAmount);
      expect(result.discounts.length).toBe(1);
      expect(result.discounts[0].message).toBe("6 FRUITS - 17$ OFF");
    });

  it("should be able to exlude products that the discount does not apply to", () => {
    const mockData = {
      ...mockProductDiscountDataWithFixedAmount,
      cart: {
        ...mockProductDiscountDataWithFixedAmount.cart,
        lines: [
          {
            id: "gid://shopify/CartLine/0",
            quantity: 6,
            sellingPlanAllocation: null,
            cost: {
              amountPerQuantity: {
                amount: "10.95",
                currencyCode: "EUR",
              },
            },
            merchandise: {
              __typename: "ProductVariant",
              id: "gid://shopify/ProductVariant/39370591273049",
              product: {
                id: "gid://shopify/Product/Apple",
              },
            },
          },
          {
            id: "gid://shopify/CartLine/1",
            quantity: 3,
            sellingPlanAllocation: null,
            cost: {
              amountPerQuantity: {
                amount: "10.95",
                currencyCode: "EUR",
              },
            },
            merchandise: {
              __typename: "ProductVariant",
              id: "gid://shopify/ProductVariant/32385157005401",
              product: {
                id: "gid://shopify/Product/NonEligible",
              },
            },
          },
        ],
      },
    };
    const result = productDiscounts(mockData);
    expect(result.discounts.length).toBe(1);
    expect(result.discounts[0].message).toBe("6 FRUITS - 17$ OFF");
  });
  it("should not apply discount to the cart if the discount is not applicable", () => {
    const mockData = {
      ...mockProductDiscountDataWithFixedAmount,
      cart: {
        ...mockProductDiscountDataWithFixedAmount.cart,
        lines: [
          {
            id: "gid://shopify/CartLine/0",
            quantity: 3,
            sellingPlanAllocation: null,
            cost: {
              amountPerQuantity: {
                amount: "10.95",
                currencyCode: "EUR",
              },
            },
            merchandise: {
              __typename: "ProductVariant",
              id: "gid://shopify/ProductVariant/39370591273049",
              product: {
                id: "gid://shopify/Product/Non",
              },
            },
          },
          {
            id: "gid://shopify/CartLine/1",
            quantity: 3,
            sellingPlanAllocation: null,
            cost: {
              amountPerQuantity: {
                amount: "10.95",
                currencyCode: "EUR",
              },
            },
            merchandise: {
              __typename: "ProductVariant",
              id: "gid://shopify/ProductVariant/32385157005401",
              product: {
                id: "gid://shopify/Product/NonEligible",
              },
            },
          },
        ],
      },
    };
    console.log(JSON.stringify(mockData, null, 2));
    const result = productDiscounts(mockData);
    expect(result.discounts.length).toBe(0);
  });
});
