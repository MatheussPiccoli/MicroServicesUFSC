export function abrirCompartimento(req, res) {
  const { locker_id, compartimento_id } = req.body;
  if (!locker_id || !compartimento_id)
    return res.status(400).json({ error: 'Campos obrigatórios: locker_id, compartimento_id' });

  console.log('COMPARTIMENTO ABERTO');
  console.log(`Locker:        ${locker_id.slice(0, 18).padEnd(18)}`);
  console.log(`Compartimento: ${compartimento_id.slice(0, 18).padEnd(18)}`);

  res.json({ mensagem: 'Compartimento aberto com sucesso', locker_id, compartimento_id });
}
