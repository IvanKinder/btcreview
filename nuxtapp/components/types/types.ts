export interface Dataset {
    label: string;
    data: number[];
    borderColor: string;
}
export interface ChartData {
    labels: string[];
    datasets: Dataset[];
}
export interface Props {
    data: ChartData;
}