export interface CommandModel {
    data: string | [] | null;
    loading?: boolean;
    error?: boolean;
    errorMsg?: string;
}