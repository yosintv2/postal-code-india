'use client';

import { useEffect } from 'react';
import { trackPincodeView } from './RecentlyViewed';

interface Props {
  pincode: string;
  officeName: string;
  districtName: string;
  stateName: string;
  stateSlug: string;
  districtSlug: string;
}

export default function PincodeTracker({ pincode, officeName, districtName, stateName, stateSlug, districtSlug }: Props) {
  useEffect(() => {
    trackPincodeView({ pincode, officeName, districtName, stateName, stateSlug, districtSlug });
  }, [pincode, officeName, districtName, stateName, stateSlug, districtSlug]);

  return null;
}
