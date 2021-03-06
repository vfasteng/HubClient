import { getReticulumFetchUrl } from "./phoenix-utils";
import { proxiedUrlFor } from "./media-utils";
import { avatars } from "../assets/avatars/avatars";

export const AVATAR_TYPES = {
  LEGACY: "legacy",
  SKINNABLE: "skinnable",
  URL: "url"
};

const legacyAvatarIds = avatars.map(a => a.id);
export function getAvatarType(avatarId) {
  if (!avatarId || legacyAvatarIds.indexOf(avatarId) !== -1) return AVATAR_TYPES.LEGACY;
  if (avatarId.startsWith("http")) return AVATAR_TYPES.URL;
  return AVATAR_TYPES.SKINNABLE;
}

async function fetchAvatarGltfUrl(avatarId) {
  const resp = await fetch(getReticulumFetchUrl(`/api/v1/avatars/${avatarId}`));
  if (resp.status === 404) {
    return null;
  } else {
    return resp.json().then(({ avatars }) => avatars[0].gltf_url);
  }
}

export function getAvatarSrc(avatarId) {
  switch (getAvatarType(avatarId)) {
    case AVATAR_TYPES.LEGACY:
      return `#${avatarId}`;
    case AVATAR_TYPES.SKINNABLE:
      return fetchAvatarGltfUrl(avatarId);
    case AVATAR_TYPES.URL:
      return proxiedUrlFor(avatarId);
    default:
      return avatarId;
  }
}

export function getAvatarGltfUrl(avatarId) {
  switch (getAvatarType(avatarId)) {
    case AVATAR_TYPES.LEGACY:
      return avatars.find(avatar => avatar.id === avatarId).model;
    case AVATAR_TYPES.SKINNABLE:
      return fetchAvatarGltfUrl(avatarId);
    case AVATAR_TYPES.URL:
      return proxiedUrlFor(avatarId);
  }
}
