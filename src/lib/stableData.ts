import type { BatchQualityData, QualityLevel } from '@/types';

export function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

export function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export function generateStableQuality(batchId: string, coatingTarget: number = 100): BatchQualityData {
  const rand = seededRandom(hashString(batchId));
  const coatingLeft = coatingTarget - 3 + rand() * 6;
  const coatingCenter = coatingTarget - 2 + rand() * 5;
  const coatingRight = coatingTarget - 3 + rand() * 6;
  const coatingAvg = (coatingLeft + coatingCenter + coatingRight) / 3;

  const qualityRand = rand();
  let qualityLevel: QualityLevel;
  if (qualityRand < 0.68) qualityLevel = '一级品';
  else if (qualityRand < 0.90) qualityLevel = '二级品';
  else if (qualityRand < 0.98) qualityLevel = '等外品';
  else qualityLevel = '报废';

  const adhesionLevel = Math.floor(rand() * 2);
  const surfaceQualityOptions = ['无缺陷', '轻微划伤', '无明显缺陷'];
  const surfaceQuality = surfaceQualityOptions[Math.floor(rand() * surfaceQualityOptions.length)];

  return {
    coatingWeightLeft: Number(coatingLeft.toFixed(1)),
    coatingWeightCenter: Number(coatingCenter.toFixed(1)),
    coatingWeightRight: Number(coatingRight.toFixed(1)),
    coatingWeightAvg: Number(coatingAvg.toFixed(1)),
    adhesionLevel,
    surfaceQuality,
    qualityLevel,
    passivationThickness: Number((0.8 + rand() * 1.2).toFixed(1)),
    dimensionalAccuracy: Number((0.01 + rand() * 0.02).toFixed(3)),
  };
}

export function generateStableCoatingHistory(batchIds: string[], targetWeight: number = 100) {
  return batchIds.flatMap((batchId) => {
    const rand = seededRandom(hashString(batchId + '_coating'));
    const positions: Array<'left' | 'center' | 'right'> = ['left', 'center', 'right'];
    return positions.map((pos, i) => ({
      id: `cd_${batchId}_${pos}`,
      batchId,
      position: pos,
      weight: Number((targetWeight - 3 + rand() * 6).toFixed(1)),
      targetWeight,
      deviation: Number((targetWeight - 3 + rand() * 6 - targetWeight).toFixed(1)),
      timestamp: new Date(Date.now() - Math.floor(rand() * 86400000 * 7)),
    }));
  });
}
