export function getPosition(id, idx, order, messages) {
  const prev = order[idx - 1];
  const next = order[idx + 1];
  const currBy = messages[id].by;
  const prevBy = prev != null ? messages[prev].by : null;
  const nextBy = next != null ? messages[next].by : null;

  if (prevBy !== currBy && nextBy === currBy) return "first";
  if (prevBy === currBy && nextBy !== currBy) return "last";
  if (prevBy !== currBy && nextBy !== currBy) return "single";
  return "middle";
}
