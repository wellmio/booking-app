import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * Test endpoint to verify Supabase connection
 * GET /api/test-supabase
 */
export async function GET() {
  try {
    // Check if environment variables are set
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing Supabase environment variables',
          details: {
            hasUrl: !!supabaseUrl,
            hasKey: !!supabaseKey,
            url: supabaseUrl ? `${supabaseUrl.substring(0, 20)}...` : 'not set',
          },
        },
        { status: 500 }
      );
    }

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Test basic connection by trying to get the current user (this tests auth connection)
    const { error: authError } = await supabase.auth.getUser();

    // Also try a simple query to test database connection
    const { data, error: dbError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .limit(1);

    // Connection is successful if we can reach Supabase (even if tables don't exist)
    return NextResponse.json({
      success: true,
      message: 'Supabase connection successful',
      details: {
        url: `${supabaseUrl.substring(0, 20)}...`,
        authWorking: !authError,
        dbWorking: !dbError,
        authError: authError?.message || null,
        dbError: dbError?.message || null,
        availableTables: data?.length || 0,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Unexpected error during Supabase test',
        details: {
          errorMessage:
            error instanceof Error ? error.message : 'Unknown error',
          errorType:
            error instanceof Error ? error.constructor.name : typeof error,
        },
      },
      { status: 500 }
    );
  }
}
