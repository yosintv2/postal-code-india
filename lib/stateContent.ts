export interface StateContent {
  overview: string;
  postalNote: string;
  pinPrefix: string;
}

export const STATE_CONTENT: Record<string, StateContent> = {
  'andhra-pradesh': {
    overview: 'Andhra Pradesh stretches along the Bay of Bengal and is home to major commercial hubs like Visakhapatnam, Vijayawada, and Tirupati. The state\'s postal network, administered under the Andhra Pradesh Postal Circle, connects densely populated coastal deltas, fertile Krishna-Godavari basin towns, and interior Rayalaseema districts.',
    postalNote: 'Most PIN codes in Andhra Pradesh begin with 5, covering eastern coastal and interior regions with over 4,000 post offices.',
    pinPrefix: '5',
  },
  'arunachal-pradesh': {
    overview: 'Arunachal Pradesh, India\'s largest northeastern state by area, borders China, Bhutan, and Myanmar. Its rugged terrain and vast forested highlands mean postal services in many areas are delivered by specially trained postmen who traverse mountain paths, making each post office here a critical lifeline for remote communities.',
    postalNote: 'Arunachal Pradesh is served under the North East postal zone; PIN codes begin with 79, one of the least densely served postal regions.',
    pinPrefix: '79',
  },
  'assam': {
    overview: 'Assam, the gateway to Northeast India, is defined by the Brahmaputra River, vast tea estates, and a rich multicultural heritage. Guwahati serves as the postal hub, and the Assam Postal Circle administers one of the most geographically varied networks in the country — from floodplain towns to hill subdivisions.',
    postalNote: 'Assam PIN codes begin with 78, with the state hosting major sorting offices in Guwahati, Dibrugarh, and Silchar.',
    pinPrefix: '78',
  },
  'bihar': {
    overview: 'Bihar, one of India\'s most densely populated states, has a postal history stretching back to the British era when it served as a key administrative region. Today, the Bihar Postal Circle headquartered in Patna connects hundreds of rural Block Post Offices in the Gangetic plains with major urban sorting facilities.',
    postalNote: 'Bihar PIN codes predominantly begin with 8, covering the Patna, Bhagalpur, Darbhanga, and Muzaffarpur circles.',
    pinPrefix: '8',
  },
  'chhattisgarh': {
    overview: 'Chhattisgarh, carved out of Madhya Pradesh in 2000, is known as India\'s "rice bowl" and covers large swathes of central India including the Bastar plateau. The Chhattisgarh Postal Circle (headquartered in Raipur) serves tribal and forested regions where branch post offices are often the sole government contact point.',
    postalNote: 'Chhattisgarh PIN codes begin with 49, reflecting its origins as part of the central India postal zone.',
    pinPrefix: '49',
  },
  'goa': {
    overview: 'Goa, India\'s smallest state, packs a cosmopolitan network of post offices across its two districts — North Goa and South Goa. Despite its small size, the state\'s tourism economy and high urban density mean post offices in Panaji, Margao, and Vasco serve some of the busiest courier volumes per capita in western India.',
    postalNote: 'Goa falls under the Goa Postal Circle; PIN codes begin with 403, covering both the coastal belt and inland talukas.',
    pinPrefix: '403',
  },
  'gujarat': {
    overview: 'Gujarat is one of India\'s foremost industrial and trading states, home to Ahmedabad, Surat, Vadodara, and Rajkot. The Gujarat Postal Circle manages a dense commercial network that handles some of the highest parcel volumes outside Maharashtra, reflecting the state\'s vibrant textile, diamond, and chemicals export industry.',
    postalNote: 'Gujarat PIN codes begin with 36–39, with major sorting hubs at Ahmedabad GPO, Surat HO, and Rajkot HO.',
    pinPrefix: '36–39',
  },
  'haryana': {
    overview: 'Haryana encircles Delhi on three sides and benefits from its proximity to the national capital. The Haryana Postal Circle covers a highly urbanised state with key industrial corridors in Gurugram, Faridabad, and Panipat, supplemented by agricultural hinterlands where delivery post offices serve thousands of villages.',
    postalNote: 'Haryana PIN codes begin with 12–13, with the head circle office at Ambala and key offices in Gurugram and Faridabad.',
    pinPrefix: '12–13',
  },
  'himachal-pradesh': {
    overview: 'Himachal Pradesh\'s postal network is among the most challenging in the country — postmen in districts like Lahaul-Spiti and Kinnaur navigate high-altitude passes often closed by snow for months at a time. The Himachal Pradesh Postal Circle, based in Shimla, administers more than 2,000 post offices across remote valleys, apple orchards, and pilgrimage routes.',
    postalNote: 'Himachal Pradesh PIN codes begin with 17, with Shimla, Manali, and Dharamshala among the major post office locations.',
    pinPrefix: '17',
  },
  'jharkhand': {
    overview: 'Jharkhand, separated from Bihar in 2000, sits on one of India\'s richest mineral belts covering coal, iron ore, and mica. The Jharkhand Postal Circle connects Ranchi, Jamshedpur, Dhanbad, and Bokaro — four rapidly growing cities — with hundreds of mining townships and tribal villages in the Chota Nagpur plateau.',
    postalNote: 'Jharkhand PIN codes begin with 82–83, with Ranchi GPO serving as the circle headquarters.',
    pinPrefix: '82–83',
  },
  'karnataka': {
    overview: 'Karnataka anchors India\'s technology sector through Bengaluru, the "Silicon Valley of India," while also home to UNESCO World Heritage Sites at Hampi and Pattadakal. The Karnataka Postal Circle manages one of India\'s largest urban postal networks in Bengaluru alongside rural circles serving coffee plantations in Coorg and coastal Dakshina Kannada.',
    postalNote: 'Karnataka PIN codes begin with 56–59, with Bengaluru GPO being one of the busiest post offices in southern India.',
    pinPrefix: '56–59',
  },
  'kerala': {
    overview: 'Kerala, known for the highest literacy rate in India and a vast diaspora especially in the Gulf region, relies heavily on India Post for remittances and official document delivery. The Kerala Postal Circle (headquartered in Thiruvananthapuram) serves a uniquely linear state where post offices run along the Western Ghats, the midland belt, and the coastal strip.',
    postalNote: 'Kerala PIN codes begin with 67–69, with Kochi, Thiruvananthapuram, and Kozhikode hosting major head offices.',
    pinPrefix: '67–69',
  },
  'madhya-pradesh': {
    overview: 'Madhya Pradesh, the geographical heart of India, is the country\'s second-largest state by area. The Madhya Pradesh Postal Circle spans diverse terrain — from the Vindhya and Satpura ranges to the Narmada valley — and maintains over 10,000 post offices, including extensive Branch Post Office networks in tribal-dominated districts.',
    postalNote: 'Madhya Pradesh PIN codes begin with 45–48, with Bhopal, Indore, Gwalior, and Jabalpur hosting major sorting centres.',
    pinPrefix: '45–48',
  },
  'maharashtra': {
    overview: 'Maharashtra, India\'s second most populous state and largest economy, hosts the Mumbai GPO — the busiest post office in Asia by mail volume. The Maharashtra Postal Circle covers a vast and economically diverse territory from Mumbai\'s financial hub and Pune\'s IT corridor to the agrarian Vidarbha and Marathwada regions.',
    postalNote: 'Maharashtra PIN codes begin with 40–44, with Mumbai GPO (400001) being India\'s most iconic postal address.',
    pinPrefix: '40–44',
  },
  'manipur': {
    overview: 'Manipur, nestled in the hills of Northeast India, has a postal network that serves both its densely populated Imphal valley and its surrounding hill districts. The state\'s branch post offices in the hill areas are often accessible only on foot or by rural tracks, making postmen here among the most dedicated in India\'s postal service.',
    postalNote: 'Manipur PIN codes begin with 79, with Imphal serving as the primary postal hub in the Manipur circle.',
    pinPrefix: '79',
  },
  'meghalaya': {
    overview: 'Meghalaya, the "abode of clouds," is home to Cherrapunji — one of the wettest places on Earth. India Post\'s network here navigates steep terrain and high rainfall while connecting Shillong, Tura, and Jowai with dozens of rural sub-post offices and branch offices in the Khasi, Jaintia, and Garo hills.',
    postalNote: 'Meghalaya PIN codes begin with 79, operating within the Northeast postal zone headquartered in Shillong.',
    pinPrefix: '79',
  },
  'mizoram': {
    overview: 'Mizoram, one of India\'s most forested states bordering Myanmar and Bangladesh, has a tight-knit postal network connecting Aizawl, Lunglei, and dozens of smaller towns. The state\'s high literacy rate and strong community ties ensure post offices serve as important social institutions beyond just mail delivery.',
    postalNote: 'Mizoram PIN codes begin with 79, with Aizawl HO serving as the primary post office for the state.',
    pinPrefix: '79',
  },
  'nagaland': {
    overview: 'Nagaland\'s diverse tribal landscape across 16 districts is served by a postal network that often relies on road-based delivery through difficult mountain terrain. Kohima and Dimapur serve as the two primary postal hubs, with postmen in remote areas sometimes walking hours through forested ridgelines to deliver official correspondence.',
    postalNote: 'Nagaland PIN codes begin with 79, located in the North East postal zone with Kohima as the circle headquarters.',
    pinPrefix: '79',
  },
  'odisha': {
    overview: 'Odisha, home to the famous Jagannath Temple in Puri and a rich tribal belt in its southern districts, has one of eastern India\'s most extensive postal networks. The Odisha Postal Circle (headquartered in Bhubaneswar) covers coastal areas prone to cyclones, forested tribal regions, and rapidly urbanising corridors along the Mahanadi.',
    postalNote: 'Odisha PIN codes begin with 75–77, with Bhubaneswar, Cuttack, and Berhampur serving as key postal centres.',
    pinPrefix: '75–77',
  },
  'punjab': {
    overview: 'Punjab, India\'s "granary," has one of the most prosperous rural postal networks in the country, reflecting the state\'s high agricultural income and the massive Non-Resident Indian (NRI) population that sends remittances through India Post. The Punjab Postal Circle (headquartered in Chandigarh) serves a compact but high-density state.',
    postalNote: 'Punjab PIN codes begin with 14–16, with Chandigarh, Amritsar, Ludhiana, and Jalandhar as major postal centres.',
    pinPrefix: '14–16',
  },
  'rajasthan': {
    overview: 'Rajasthan, India\'s largest state by area, presents the postal service with its most extreme geographic challenge — delivering mail across the Thar Desert, Aravalli hills, and semi-arid grasslands. The Rajasthan Postal Circle (headquartered in Jaipur) operates over 10,000 post offices including many in remote desert towns accessible only by camel track.',
    postalNote: 'Rajasthan PIN codes begin with 30–34, with Jaipur GPO, Jodhpur HO, and Udaipur HO among the major offices.',
    pinPrefix: '30–34',
  },
  'sikkim': {
    overview: 'Sikkim, India\'s smallest state by population, is a high-altitude Himalayan state bordering Nepal, Bhutan, China, and West Bengal. Its postal network must operate at elevations up to 5,000 metres in districts like North Sikkim, making India Post deliveries here among the world\'s highest-altitude mail routes.',
    postalNote: 'Sikkim PIN codes begin with 737, with Gangtok HO as the lone major sorting facility for the state.',
    pinPrefix: '737',
  },
  'tamil-nadu': {
    overview: 'Tamil Nadu, one of India\'s most industrialised southern states, has a postal history going back to the East India Company era. The Tamilnadu Postal Circle (headquartered in Chennai) serves a state that spans the Deccan plateau, the Cauvery delta, the Nilgiri hills, and a long coastline — each zone with its own postal characteristics.',
    postalNote: 'Tamil Nadu PIN codes begin with 60–64, with Chennai GPO being one of the oldest continuously operating head offices in India.',
    pinPrefix: '60–64',
  },
  'tripura': {
    overview: 'Tripura, almost entirely surrounded by Bangladesh on three sides, has one of the Northeast\'s most distinctive postal networks. India Post in Tripura plays a crucial cross-border communication role, and the state\'s capital Agartala hosts a Head Office that connects the region to the rest of India via road and air mail routes.',
    postalNote: 'Tripura PIN codes begin with 799, with Agartala serving as the primary postal centre for all four districts.',
    pinPrefix: '799',
  },
  'uttar-pradesh': {
    overview: 'Uttar Pradesh, India\'s most populous state, has the largest postal network of any Indian state with over 18,000 post offices. The Uttar Pradesh Postal Circle (headquartered in Lucknow) covers everything from the dense Ganga-Yamuna Doab towns to pilgrimage cities like Varanasi and Mathura, handling one of the highest mail volumes in the country.',
    postalNote: 'UP PIN codes begin with 20–28, with Lucknow GPO, Kanpur HO, Varanasi HO, and Allahabad HO as major sorting centres.',
    pinPrefix: '20–28',
  },
  'uttarakhand': {
    overview: 'Uttarakhand, the "Land of Gods," encompasses the Garhwal and Kumaon divisions of the Himalayas. Postal services here support both a significant permanent mountain population and millions of pilgrims visiting Char Dham shrines. The Uttarakhand Postal Circle operates high-altitude offices, some of which only function during the summer pilgrimage season.',
    postalNote: 'Uttarakhand PIN codes begin with 24–26, with Dehradun, Haridwar, and Nainital among the prominent postal centres.',
    pinPrefix: '24–26',
  },
  'west-bengal': {
    overview: 'West Bengal, anchored by Kolkata — India\'s oldest metropolitan postal city — has a postal network steeped in colonial history. The GPO Kolkata (built in 1864) remains one of India\'s most iconic post offices. The West Bengal Postal Circle extends from the Sundarbans delta, one of the world\'s most complex delivery environments, to the Himalayan foothills of Darjeeling.',
    postalNote: 'West Bengal PIN codes begin with 70–74, with Kolkata GPO (700001) being one of India\'s most historic postal addresses.',
    pinPrefix: '70–74',
  },
  'andaman-and-nicobar-islands': {
    overview: 'The Andaman & Nicobar Islands, an archipelago of 572 islands in the Bay of Bengal, represent India Post\'s most logistically complex delivery zone. Mail reaches these islands exclusively by ship or air, and sub-post offices on inhabited remote islands like Car Nicobar and Havelock rely on inter-island ferry services for regular mail delivery.',
    postalNote: 'Andaman & Nicobar PIN codes begin with 744, with Port Blair HO as the only major postal hub for the entire island chain.',
    pinPrefix: '744',
  },
  'chandigarh': {
    overview: 'Chandigarh, the meticulously planned union territory designed by Le Corbusier, serves as the capital of both Punjab and Haryana. Despite its small area, Chandigarh\'s high urban density and status as a government and administrative hub means its post offices handle disproportionately large volumes of official mail, court documents, and government communications.',
    postalNote: 'Chandigarh PIN codes begin with 160, with Chandigarh Sector 17 HO serving as the primary head office for the UT.',
    pinPrefix: '160',
  },
  'dadra-and-nagar-haveli-and-daman-and-diu': {
    overview: 'This merged union territory, combining the former UTs of Dadra & Nagar Haveli and Daman & Diu, spans two distinct coastal and inland enclaves in western India. The region\'s free-trade zone status and industrial estates around Silvassa generate significant commercial mail, while coastal Daman and Diu have their own distinctive postal micro-networks.',
    postalNote: 'PIN codes here begin with 396 (Daman) and 362 (Diu) and 396 (Dadra & NH), served under the Gujarat Postal Circle.',
    pinPrefix: '362–396',
  },
  'delhi': {
    overview: 'Delhi, India\'s national capital territory, has one of the world\'s densest urban postal networks within its 1,484 sq km. New Delhi GPO (110001) is among the highest-volume post offices in Asia, processing government correspondence, diplomatic mail, and commercial parcels for the capital region. Delhi\'s PIN codes range from 110001 to 110096, each tied to a specific urban zone.',
    postalNote: 'Delhi PIN codes begin with 11, with over 400 sub-post offices and branch offices across 11 revenue districts.',
    pinPrefix: '11',
  },
  'jammu-and-kashmir': {
    overview: 'Jammu & Kashmir, a union territory since 2019, has a unique dual-climate postal network divided between the Jammu division (plains and Shivaliks) and the Kashmir Valley (high-altitude Himalayan region). Winter snowfall regularly cuts off road access to remote post offices in Kargil, Gurez, and Lolab valley, making India Post deliveries here a testament to dedication.',
    postalNote: 'J&K PIN codes begin with 18–19, with Srinagar GPO and Jammu HO as the two major circle offices.',
    pinPrefix: '18–19',
  },
  'ladakh': {
    overview: 'Ladakh, India\'s newest and highest union territory, stretches across the Karakoram and Himalayan ranges at altitudes between 3,000 and 6,000 metres. India Post operates here under extraordinary conditions — roads to Leh and Kargil are snow-blocked for months — making the Leh Head Post Office a critical communication gateway to some of the world\'s most remote communities.',
    postalNote: 'Ladakh PIN codes begin with 194, with Leh HO and Kargil HO as the two primary postal hubs in the high-altitude territory.',
    pinPrefix: '194',
  },
  'lakshadweep': {
    overview: 'Lakshadweep, India\'s smallest union territory by population, consists of 36 coral atolls in the Arabian Sea. Mail delivery across these islands depends entirely on ship services (which sail from Kochi) or occasional air connections, making Lakshadweep\'s postal service one of the slowest but most essential in the country for its 65,000 residents.',
    postalNote: 'Lakshadweep PIN codes begin with 682, with Kavaratti HO serving as the only head post office for all inhabited islands.',
    pinPrefix: '682',
  },
  'puducherry': {
    overview: 'Puducherry (Pondicherry) is a former French colony that retains its distinctive colonial heritage through tree-lined boulevards and French-style architecture. The union territory\'s four non-contiguous enclaves — Pondicherry, Karaikal, Mahé, and Yanam — are administered by different regional postal circles, making Puducherry uniquely spread across three different Indian states.',
    postalNote: 'Puducherry PIN codes begin with 605 (Pondicherry), 609 (Karaikal), 673 (Mahé), and 533 (Yanam), reflecting its geographically separate enclaves.',
    pinPrefix: '533–673',
  },
};

export function getStateContent(stateSlug: string): StateContent | null {
  return STATE_CONTENT[stateSlug] ?? null;
}
