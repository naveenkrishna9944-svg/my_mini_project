export function numberFromInput(value) {
  if (typeof value === 'number' || (typeof value === 'string' && value.trim())) {
    return Number(value);
  }
  return NaN;
}

export function isStockCount(value) {
  return Number.isInteger(value) && value >= 0 && value <= 2_147_483_647;
}

export function isProductId(value) {
  return typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}
