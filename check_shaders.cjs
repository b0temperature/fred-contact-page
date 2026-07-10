(async () => {
  const sh = await import('shaders/react');
  console.log("ChromaFlow:", sh.ChromaFlow.toString().substring(0, 1000));
})();
