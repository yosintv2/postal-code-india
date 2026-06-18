import type { StateInfo } from '@/types/pincode';

export const STATES: StateInfo[] = [
  { name: 'Andhra Pradesh',              slug: 'andhra-pradesh',              apiFile: 'andhra_pradesh',              capital: 'Amaravati',      type: 'state' },
  { name: 'Arunachal Pradesh',           slug: 'arunachal-pradesh',           apiFile: 'arunachal_pradesh',           capital: 'Itanagar',       type: 'state' },
  { name: 'Assam',                       slug: 'assam',                       apiFile: 'assam',                       capital: 'Dispur',         type: 'state' },
  { name: 'Bihar',                       slug: 'bihar',                       apiFile: 'bihar',                       capital: 'Patna',          type: 'state' },
  { name: 'Chhattisgarh',               slug: 'chhattisgarh',               apiFile: 'chattisgarh',                 capital: 'Raipur',         type: 'state' },
  { name: 'Goa',                         slug: 'goa',                         apiFile: 'goa',                         capital: 'Panaji',         type: 'state' },
  { name: 'Gujarat',                     slug: 'gujarat',                     apiFile: 'gujarat',                     capital: 'Gandhinagar',    type: 'state' },
  { name: 'Haryana',                     slug: 'haryana',                     apiFile: 'haryana',                     capital: 'Chandigarh',     type: 'state' },
  { name: 'Himachal Pradesh',            slug: 'himachal-pradesh',            apiFile: 'himachal_pradesh',            capital: 'Shimla',         type: 'state' },
  { name: 'Jharkhand',                   slug: 'jharkhand',                   apiFile: 'jharkhand',                   capital: 'Ranchi',         type: 'state' },
  { name: 'Karnataka',                   slug: 'karnataka',                   apiFile: 'karnataka',                   capital: 'Bengaluru',      type: 'state' },
  { name: 'Kerala',                      slug: 'kerala',                      apiFile: 'kerala',                      capital: 'Thiruvananthapuram', type: 'state' },
  { name: 'Madhya Pradesh',              slug: 'madhya-pradesh',              apiFile: 'madhya_pradesh',              capital: 'Bhopal',         type: 'state' },
  { name: 'Maharashtra',                 slug: 'maharashtra',                 apiFile: 'maharashtra',                 capital: 'Mumbai',         type: 'state' },
  { name: 'Manipur',                     slug: 'manipur',                     apiFile: 'manipur',                     capital: 'Imphal',         type: 'state' },
  { name: 'Meghalaya',                   slug: 'meghalaya',                   apiFile: 'meghalaya',                   capital: 'Shillong',       type: 'state' },
  { name: 'Mizoram',                     slug: 'mizoram',                     apiFile: 'mizoram',                     capital: 'Aizawl',         type: 'state' },
  { name: 'Nagaland',                    slug: 'nagaland',                    apiFile: 'nagaland',                    capital: 'Kohima',         type: 'state' },
  { name: 'Odisha',                      slug: 'odisha',                      apiFile: 'odisha',                      capital: 'Bhubaneswar',    type: 'state' },
  { name: 'Punjab',                      slug: 'punjab',                      apiFile: 'punjab',                      capital: 'Chandigarh',     type: 'state' },
  { name: 'Rajasthan',                   slug: 'rajasthan',                   apiFile: 'rajasthan',                   capital: 'Jaipur',         type: 'state' },
  { name: 'Sikkim',                      slug: 'sikkim',                      apiFile: 'sikkim',                      capital: 'Gangtok',        type: 'state' },
  { name: 'Tamil Nadu',                  slug: 'tamil-nadu',                  apiFile: 'tamil_nadu',                  capital: 'Chennai',        type: 'state' },
  { name: 'Tripura',                     slug: 'tripura',                     apiFile: 'tripura',                     capital: 'Agartala',       type: 'state' },
  { name: 'Uttar Pradesh',               slug: 'uttar-pradesh',               apiFile: 'uttar_pradesh',               capital: 'Lucknow',        type: 'state' },
  { name: 'Uttarakhand',                 slug: 'uttarakhand',                 apiFile: 'uttarakhand',                 capital: 'Dehradun',       type: 'state' },
  { name: 'West Bengal',                 slug: 'west-bengal',                 apiFile: 'west_bengal',                 capital: 'Kolkata',        type: 'state' },
  // Union Territories
  { name: 'Andaman & Nicobar Islands',   slug: 'andaman-and-nicobar-islands', apiFile: 'andaman_and_nicobar_islands', capital: 'Port Blair',     type: 'ut' },
  { name: 'Chandigarh',                  slug: 'chandigarh',                  apiFile: 'chandigarh',                  capital: 'Chandigarh',     type: 'ut' },
  { name: 'Dadra & Nagar Haveli',        slug: 'dadra-and-nagar-haveli',      apiFile: 'dadra_and_nagar_haveli',      capital: 'Silvassa',       type: 'ut' },
  { name: 'Daman & Diu',                 slug: 'daman-and-diu',               apiFile: 'daman_and_diu',               capital: 'Daman',          type: 'ut' },
  { name: 'Delhi',                       slug: 'delhi',                       apiFile: 'delhi',                       capital: 'New Delhi',      type: 'ut' },
  { name: 'Jammu & Kashmir',             slug: 'jammu-and-kashmir',           apiFile: 'jammu_and_kashmir',           capital: 'Srinagar',       type: 'ut' },
  { name: 'Lakshadweep',                 slug: 'lakshadweep',                 apiFile: 'lakshadweep',                 capital: 'Kavaratti',      type: 'ut' },
  { name: 'Puducherry',                  slug: 'puducherry',                  apiFile: 'pondicherry',                 capital: 'Puducherry',     type: 'ut' },
];

export const STATES_BY_SLUG = new Map(STATES.map(s => [s.slug, s]));
export const STATES_BY_FILE = new Map(STATES.map(s => [s.apiFile, s]));
