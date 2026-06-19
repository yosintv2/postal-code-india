import type { PostOffice, DistrictData, StateData, PincodeGroup } from '@/types/pincode';
import { STATES, STATES_BY_SLUG } from '@/lib/states';
import { toSlug } from '@/lib/utils';

const API_BASE = 'https://api.singhyogendra.com.np/india-pincode';

async function fetchWithRetry(url: string, retries = 4, delayMs = 1500): Promise<Response> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, { next: { revalidate: false } });
      if (res.ok) return res;
      throw new Error(`HTTP ${res.status}`);
    } catch (err) {
      if (attempt === retries) throw err;
      await new Promise(r => setTimeout(r, delayMs * (attempt + 1)));
    }
  }
  throw new Error('unreachable');
}

export async function fetchStateOffices(apiFile: string): Promise<PostOffice[]> {
  const res = await fetchWithRetry(`${API_BASE}/${apiFile}.json`);
  const text = await res.text();
  // Strip bare control characters (U+0000–U+001F) that are invalid inside JSON strings,
  // keeping tab (0x09), newline (0x0A) and carriage-return (0x0D) which JSON allows.
  const clean = text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '');
  return JSON.parse(clean);
}

function groupOffices(offices: PostOffice[]): DistrictData[] {
  const districtMap = new Map<string, Map<string, PostOffice[]>>();

  for (const office of offices) {
    const district = office.districtName?.trim() || 'Unknown';
    if (!districtMap.has(district)) districtMap.set(district, new Map());
    const pincodeMap = districtMap.get(district)!;
    const pin = office.pincode?.trim() || '000000';
    if (!pincodeMap.has(pin)) pincodeMap.set(pin, []);
    pincodeMap.get(pin)!.push(office);
  }

  return Array.from(districtMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([districtName, pincodeMap]) => {
      const pincodes: PincodeGroup[] = Array.from(pincodeMap.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([pincode, officeList]) => ({
          pincode,
          offices: officeList,
          hasHeadOffice: officeList.some(o => o.officeType === 'H.O'),
        }));

      const allPins = pincodes.map(p => p.pincode);
      const totalOffices = pincodes.reduce((s, p) => s + p.offices.length, 0);

      return {
        districtName,
        districtSlug: toSlug(districtName),
        pincodes,
        totalOffices,
        pincodeRange: {
          min: allPins.reduce((a, b) => (a < b ? a : b), allPins[0] ?? ''),
          max: allPins.reduce((a, b) => (a > b ? a : b), allPins[0] ?? ''),
        },
      };
    });
}

export async function getStateData(stateSlug: string): Promise<StateData | null> {
  const info = STATES_BY_SLUG.get(stateSlug);
  if (!info) return null;
  const offices = await fetchStateOffices(info.apiFile);
  const districts = groupOffices(offices);
  return {
    stateName: info.name,
    stateSlug: info.slug,
    apiFile: info.apiFile,
    districts,
    totalDistricts: districts.length,
    totalOffices: offices.length,
  };
}

export async function getAllStateSlugs(): Promise<string[]> {
  return STATES.map(s => s.slug);
}

export async function getDistrictData(
  stateSlug: string,
  districtSlug: string,
): Promise<{ state: StateData; district: DistrictData } | null> {
  const stateData = await getStateData(stateSlug);
  if (!stateData) return null;
  const district = stateData.districts.find(d => d.districtSlug === districtSlug);
  if (!district) return null;
  return { state: stateData, district };
}

export async function getPincodeData(
  stateSlug: string,
  districtSlug: string,
  pincode: string,
): Promise<{ state: StateData; district: DistrictData; group: PincodeGroup } | null> {
  const result = await getDistrictData(stateSlug, districtSlug);
  if (!result) return null;
  const group = result.district.pincodes.find(p => p.pincode === pincode);
  if (!group) return null;
  return { ...result, group };
}
