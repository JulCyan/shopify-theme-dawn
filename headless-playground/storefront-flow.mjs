import process from 'node:process';

// Required runtime inputs. Keep token/domain in env vars, never hardcode in source.
const domain = process.env.SHOPIFY_STORE_DOMAIN;
const token = process.env.SHOPIFY_STOREFRONT_TOKEN;
const version = process.env.SHOPIFY_API_VERSION || '2025-10';

if (!domain || !token) {
  console.error(
    '[storefront-flow] Missing env vars. Required: SHOPIFY_STORE_DOMAIN, SHOPIFY_STOREFRONT_TOKEN'
  );
  process.exit(1);
}

const endpoint = `https://${domain}/api/${version}/graphql.json`;

// Shared GraphQL client: centralizes error handling for both query/mutation calls.
async function storefrontRequest(query, variables = {}) {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': token,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`[storefront-flow] HTTP ${response.status} ${response.statusText}`);
  }

  const payload = await response.json();
  if (payload.errors?.length) {
    throw new Error(`[storefront-flow] GraphQL errors: ${JSON.stringify(payload.errors, null, 2)}`);
  }

  return payload.data;
}

// Step 1: query recent products and variants to get a valid merchandiseId for cart create.
async function queryProducts() {
  const query = `
    query ProductsForPractice($first: Int!) {
      products(first: $first, sortKey: UPDATED_AT, reverse: true) {
        nodes {
          id
          handle
          title
          variants(first: 5) {
            nodes {
              id
              title
              availableForSale
              price {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  `;

  const data = await storefrontRequest(query, { first: 5 });
  return data.products.nodes;
}

// Step 2: create a cart with one variant line item.
async function createCart(merchandiseId) {
  const mutation = `
    mutation CreatePracticeCart($lines: [CartLineInput!]) {
      cartCreate(input: { lines: $lines }) {
        cart {
          id
          checkoutUrl
          totalQuantity
          cost {
            subtotalAmount {
              amount
              currencyCode
            }
          }
          lines(first: 10) {
            nodes {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  product {
                    title
                    handle
                  }
                }
              }
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const data = await storefrontRequest(mutation, {
    lines: [
      {
        quantity: 1,
        merchandiseId,
      },
    ],
  });

  if (data.cartCreate.userErrors?.length) {
    throw new Error(
      `[storefront-flow] cartCreate userErrors: ${JSON.stringify(data.cartCreate.userErrors, null, 2)}`
    );
  }

  return data.cartCreate.cart;
}

async function main() {
  // The flow is intentionally linear for learning/debugging:
  // products -> first variant -> cartCreate -> print structured result.
  const products = await queryProducts();
  const firstVariant = products.flatMap((product) => product.variants.nodes).find(Boolean);

  if (!firstVariant) {
    throw new Error('[storefront-flow] No variants found. Make sure your store has products with variants.');
  }

  const cart = await createCart(firstVariant.id);

  const result = {
    store: domain,
    apiVersion: version,
    selectedVariantId: firstVariant.id,
    selectedVariantTitle: firstVariant.title,
    cart: {
      id: cart.id,
      totalQuantity: cart.totalQuantity,
      checkoutUrl: cart.checkoutUrl,
      subtotal: cart.cost.subtotalAmount,
      lines: cart.lines.nodes.map((line) => ({
        id: line.id,
        quantity: line.quantity,
        variantId: line.merchandise.id,
        variantTitle: line.merchandise.title,
        productTitle: line.merchandise.product.title,
        productHandle: line.merchandise.product.handle,
      })),
    },
  };

  console.log(JSON.stringify(result, null, 2));
}

// Unified fail-fast output, so terminal logs stay readable during API troubleshooting.
main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
