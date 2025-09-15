import { NextResponse } from 'next/server';
import { 
  inflationRatesGermany, 
  inflationCauses, 
  historicalEvents, 
  quizQuestions,
  priceExamples 
} from '@/data/inflationData';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');

  try {
    switch (type) {
      case 'rates':
        return NextResponse.json({
          success: true,
          data: inflationRatesGermany
        });
      
      case 'causes':
        return NextResponse.json({
          success: true,
          data: inflationCauses
        });
      
      case 'historical':
        return NextResponse.json({
          success: true,
          data: historicalEvents
        });
      
      case 'quiz':
        return NextResponse.json({
          success: true,
          data: quizQuestions
        });
      
      case 'prices':
        return NextResponse.json({
          success: true,
          data: priceExamples
        });
      
      case 'all':
        return NextResponse.json({
          success: true,
          data: {
            rates: inflationRatesGermany,
            causes: inflationCauses,
            historical: historicalEvents,
            quiz: quizQuestions,
            prices: priceExamples
          }
        });
      
      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid type parameter. Use: rates, causes, historical, quiz, prices, or all'
        }, { status: 400 });
    }
  } catch {
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}
