import { NextRequest, NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { resolve } from 'path';

interface Corp {
  corp_code: string;
  corp_name: string;
  corp_eng_name: string;
  stock_code: string;
}

let corpIndex: Corp[] = [];

function loadCorpIndex(): Corp[] {
  if (corpIndex.length === 0) {
    try {
      const corpIndexPath = resolve(process.cwd(), 'public/corp-index.json');
      const data = readFileSync(corpIndexPath, 'utf-8');
      corpIndex = JSON.parse(data);
    } catch (error) {
      console.error('Failed to load corp index:', error);
      return [];
    }
  }
  return corpIndex;
}

function normalizeSearchTerm(term: string): string {
  return term.toLowerCase().trim();
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query || query.length < 1) {
    return NextResponse.json({ results: [] });
  }

  const corps = loadCorpIndex();
  const normalized = normalizeSearchTerm(query);

  const results = corps
    .filter(
      (corp) =>
        normalizeSearchTerm(corp.corp_name || '').includes(normalized) ||
        normalizeSearchTerm(corp.corp_eng_name || '').includes(normalized) ||
        String(corp.stock_code || '').includes(normalized) ||
        String(corp.corp_code || '').includes(normalized)
    )
    .slice(0, 20);

  return NextResponse.json({ results });
}
