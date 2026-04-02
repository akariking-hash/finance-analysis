export interface FinancialItem {
  rcept_no: string;
  reprt_code: string;
  bsns_year: string;
  corp_code: string;
  stock_code: string;
  fs_div: string; // OFS: 개별, CFS: 연결
  fs_nm: string;
  sj_div: string; // BS: 재무상태표, IS: 손익계산서
  sj_nm: string;
  account_nm: string;
  thstrm_nm: string;
  thstrm_dt: string;
  thstrm_amount: string;
  thstrm_add_amount?: string;
  frmtrm_nm: string;
  frmtrm_dt: string;
  frmtrm_amount: string;
  frmtrm_add_amount?: string;
  bfefrmtrm_nm?: string;
  bfefrmtrm_dt?: string;
  bfefrmtrm_amount?: string;
  ord: string;
  currency: string;
}

export interface OpenDartResponse {
  status: string;
  message: string;
  list: FinancialItem[];
}

export interface OpenDartError {
  statusCode: number;
  message: string;
}

export async function fetchFinancials(
  apiKey: string,
  corpCode: string,
  year: string,
  reportCode: string
): Promise<OpenDartResponse | OpenDartError> {
  if (!apiKey) {
    return {
      statusCode: 503,
      message: 'OpenDart API 키가 설정되지 않았습니다.',
    };
  }

  try {
    const url = new URL('https://opendart.fss.or.kr/api/fnlttSinglAcnt.json');
    url.searchParams.append('crtfc_key', apiKey);
    url.searchParams.append('corp_code', corpCode);
    url.searchParams.append('bsns_year', year);
    url.searchParams.append('reprt_code', reportCode);

    const response = await fetch(url.toString());

    if (!response.ok) {
      return {
        statusCode: response.status,
        message: `OpenDart API 요청 실패: ${response.statusText}`,
      };
    }

    const data: OpenDartResponse = await response.json();

    if (data.status !== '000') {
      return {
        statusCode: 400,
        message: `OpenDart 오류: ${data.message}`,
      };
    }

    return data;
  } catch (error) {
    return {
      statusCode: 500,
      message: `서버 오류: ${error instanceof Error ? error.message : '알 수 없는 오류'}`,
    };
  }
}
