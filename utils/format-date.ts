export function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  export function calculateDuration(startDate: string, endDate: string): string {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffInMs = end.getTime() - start.getTime();
    const durationInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24)); // Convert ms to days
    return `${durationInDays} days`;
  }