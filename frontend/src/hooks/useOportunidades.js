
import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';

import { atualizarStatusOportunidade, getOportunidades } from '../services/api';
import { correspondeAoTermo } from '../utils/formatters';

const STATUS_ENCERRADA = 'encerrada';

export function useOportunidades() {
  const [oportunidades, setOportunidades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [categoria, setCategoria] = useState('');
  const [termoBusca, setTermoBusca] = useState('');
  const buscaAdiada = useDeferredValue(termoBusca);
  const categoriaRef = useRef('');


  const oportunidadesVisiveis = useMemo(
    () => oportunidades.filter((oportunidade) => correspondeAoTermo(oportunidade, buscaAdiada.trim())),
    [oportunidades, buscaAdiada],
  );

  const carregarOportunidades = useCallback(async (novaCategoria) => {
    setLoading(true);
    setError(null);
    try {
      setOportunidades(await getOportunidades({ categoria: novaCategoria ?? categoriaRef.current }));
    } catch (erro) {
      setOportunidades([]);
      setError(erro.mensagem ?? 'Não foi possível carregar as oportunidades.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarOportunidades('');
  }, [carregarOportunidades]);

  const definirCategoria = useCallback(
    (novaCategoria) => {
      categoriaRef.current = novaCategoria;
      setCategoria(novaCategoria);
      return carregarOportunidades(novaCategoria);
    },
    [carregarOportunidades],
  );

  const alternarStatus = useCallback(
    async (id, novoStatus) => {
      setError(null);
      let removida = null;
      setOportunidades((atuais) => {
        removida = atuais.find((oportunidade) => oportunidade.id === id) ?? null;
        if (novoStatus === STATUS_ENCERRADA) {
          return atuais.filter((oportunidade) => oportunidade.id !== id);
        }
        return atuais.map((oportunidade) =>
          oportunidade.id === id ? { ...oportunidade, status: novoStatus } : oportunidade,
        );
      });

      try {
        await atualizarStatusOportunidade(id, novoStatus);
        if (novoStatus !== STATUS_ENCERRADA) await carregarOportunidades();
        return true;
      } catch (erro) {
        if (removida) {
          setOportunidades((atuais) =>
            atuais.some((oportunidade) => oportunidade.id === id)
              ? atuais
              : [...atuais, removida],
          );
        }
        setError(erro.mensagem ?? 'Não foi possível alterar o status.');
        return false;
      }
    },
    [carregarOportunidades],
  );

  const limparErro = useCallback(() => setError(null), []);

  return {
    oportunidades: oportunidadesVisiveis,
    loading,
    error,
    categoria,
    definirCategoria,
    termoBusca,
    definirTermoBusca: setTermoBusca,
    carregarOportunidades,
    alternarStatus,
    limparErro,
  };
}

export default useOportunidades;
