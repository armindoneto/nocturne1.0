/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SharedFileItem {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: string; // ISO string
  dataUrl: string; // Base64 data URL
}

export interface ShareScreenProps {
  sharedFile: SharedFileItem | null;
  setSharedFile: (file: SharedFileItem | null | ((prev: SharedFileItem | null) => SharedFileItem | null)) => void;
  triggerToast: (msg: string) => void;
  theme?: 'dark' | 'light';
}
