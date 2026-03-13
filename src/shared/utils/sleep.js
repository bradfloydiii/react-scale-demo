export function sleep(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

export function message(msg) {
  console.log(`${msg}`);
}
