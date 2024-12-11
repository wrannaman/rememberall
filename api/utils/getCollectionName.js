export default function getCollectionName(orgId) {
  return `a${orgId.replace(/-/g, '_')}`
}