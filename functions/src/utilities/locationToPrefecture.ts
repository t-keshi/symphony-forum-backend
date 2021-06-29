import { PREFECTURES } from '../constants/prefectures';

export const extractPrefectureFromAddress = (
  location: string,
): string | undefined => {
  const threeHeadCharacter = location.slice(0, 2);
  const fourCharacterPrefectures = [
    PREFECTURES.和歌山県,
    PREFECTURES.神奈川県,
    PREFECTURES.鹿児島県,
  ].map((prefecture) => prefecture.slice(0, 2));
  const isFourCharacterPrefectures = fourCharacterPrefectures.some(
    (prefecture) => prefecture === threeHeadCharacter,
  );
  const maybePrefecture = isFourCharacterPrefectures
    ? `${threeHeadCharacter}県`
    : threeHeadCharacter;
  const prefecture = Object.keys(PREFECTURES).some(
    (prefecture) => prefecture === maybePrefecture,
  )
    ? maybePrefecture
    : undefined;

  return prefecture;
};
