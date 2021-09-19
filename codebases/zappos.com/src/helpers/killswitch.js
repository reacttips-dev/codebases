export const cleanKillswitches = data => {
  // Delete unneeded fields, and ensure key-value pairs are booleans
  const killswitch = data?.Global?.slotData?.killswitch;
  if (killswitch) {
    delete killswitch?.['pf_rd_p'];
    delete killswitch?.['pf_rd_r'];
    delete killswitch?.componentName;
    Object.entries(killswitch).forEach(([key, value]) => {
      if (typeof value === 'string') {
        if (value.toLowerCase() === 'true') {
          killswitch[key] = true;
        } else if (value.toLowerCase() === 'false') {
          killswitch[key] = false;
        }
      }
    });
  }
  return data;
};
