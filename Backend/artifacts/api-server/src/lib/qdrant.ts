const qdrantUrl = process.env.QDRANT_URL ?? "http://localhost:6333";
const collectionName = process.env.QDRANT_MO_COLLECTION ?? "modus_operandi";
const vectorSize = Number(process.env.QDRANT_VECTOR_SIZE ?? "768");

export const ensureQdrantCollection = async (): Promise<void> => {
  const response = await fetch(`${qdrantUrl}/collections/${collectionName}`);

  if (response.ok) {
    return;
  }

  await fetch(`${qdrantUrl}/collections`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      collection_name: collectionName,
      vectors: {
        size: vectorSize,
        distance: "Cosine",
      },
      hnsw_config: {
        m: 16,
        ef_construct: 200,
        ef_search: 64,
      },
      optimizers_config: {
        default_segment_number: 1,
      },
    }),
  });
};

export const generateTextEmbedding = (text: string): number[] => {
  const values = new Array<number>(vectorSize).fill(0);
  for (let index = 0; index < text.length; index += 1) {
    values[index % vectorSize] += text.charCodeAt(index) / 255;
  }
  return values.map((v) => Math.tanh(v));
};

export const searchMoVectors = async (
  embedding: number[],
  threshold = 0.75,
  districtFilter?: string,
): Promise<Array<{ fir_id: number; score: number; district?: string; bns_section?: string }>> => {
  const query: any = {
    vector: embedding,
    top: 10,
    params: { hnsw_ef: 64 },
    with_payload: true,
  };

  if (districtFilter) {
    query.filter = {
      must: [{ key: "district", match: { value: districtFilter } }],
    };
  }

  const response = await fetch(`${qdrantUrl}/collections/${collectionName}/points/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(query),
  });

  const payload = await response.json();
  return (payload.result ?? [])
    .filter((item: any) => item.score >= threshold)
    .map((item: any) => ({
      fir_id: Number(item.id),
      score: item.score,
      district: item.payload?.district,
      bns_section: item.payload?.bns_section,
    }));
};
