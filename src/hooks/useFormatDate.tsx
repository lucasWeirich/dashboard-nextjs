export function useFormatDate(date: string) {
  if (!date) {
    return 'N/A';
  }

  const options:{} =  {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  };

  const formattedDate = new Date(date).toLocaleDateString('pt-BR', options);
  return formattedDate;
}