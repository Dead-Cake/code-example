export function getGlossaryValue (list: Array<any>, id: number, code: string): string {
  return list.find(l => l.id === id) ? list.find(l => l.id === id)[code] : '-';
}

export function getSubGlossaryValue (list: Array<any>, id: string, code: string, subName: string): string {
  let result;
  list.map(el => {
    const subGlossaryValue = el[`${subName}`].find(l => l.id === id);
    if (subGlossaryValue) {
      result = subGlossaryValue[code];
    }
  });
  return result ? result : '-';
}
