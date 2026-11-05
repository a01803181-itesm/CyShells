export interface KPI {
    id: string;
    title: string;
    value: string;
    subtext: string;
    indicatorColour: string;
};

export async function getKPIs(): Promise<KPI[]> {
    const response = await fetch("/api/v1/dashboard/kpis");
    if (!response.ok) {
        throw new Error("Failed at fetching KPIs from server");
    }
    return response.json();
}

export interface Account {
    name: string;
    followers: number;
};

export interface Hashtag {
    label: string
    count: number;
};

export interface Charts {
    top_accounts: Account[];
    top_hashtags: Hashtag[];
};

export async function getCharts(): Promise<Charts> {
    const response = await fetch("/api/v1/dashboard/charts");
    if (!response.ok) {
        throw new Error("Failed to fetch Charts data from server");
    }
    return response.json();
}

export interface TableRow {
    videoId: string;
    username: string;
    avatarUrl: string;
    description: string;
    plays: number;
    likes: number;
    riskLevel: string;
    scrapedAt: string;
};

export interface TableData {
    data: TableRow[];
};

export async function getTableRows({ page = 1, limit = 10, risk = "", search = ""}): Promise<TableData> {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (risk) params.append("risk", risk);
    if (search) params.append("search", search);
    const response = await fetch("/api/v1/dashboard/table");
    if (!response.ok) {
        throw new Error("Failed to fetch Table data from server");
    }
    return response.json();
}

export interface GalleryCard {
    id: string;
    user: string;
    risk: string;
    labels: string[];
    image: string;
};

export async function getOmegaGalleryImages(risk: string): Promise<GalleryCard[]> {
    const params = new URLSearchParams();
    if (risk) params.append("risk", risk);
    const response = await fetch(`/api/v1/ict/omega/gallery?${params.toString()}`);
    if (!response.ok) {
        throw new Error("Failed to fetch Omega gallery images from server");
    }
    const json = await response.json();
    return json.data || [];
}