var VCF = function() {
  this.clock = function(a, k) {
    return a;
  }
}
/*
class VCF
{
  static const uint8_t* m_lpfTable;
  static uint8_t        m_cutoffFrequency;
  static uint8_t        m_resonance;
  static uint8_t        m_envelopeAmount;
  static int8_t         m_x1;
  static int8_t         m_x2;
  static int8_t         m_y1;
  static int8_t         m_y2;

public:
  static void setCutoffFrequency(uint8_t cutoffFrequency)
  {
    m_cutoffFrequency = cutoffFrequency;
  }

  static void setResonance(uint8_t resonance)
  {
    m_resonance = resonance;
    if (resonance & 0x40) {
      m_lpfTable = g_lpfTableQSqrt2;
    } else {
      m_lpfTable = g_lpfTableQ1OverSqrt2;
    }
  }

  static void setEnvelopeAmount(uint8_t envelopeAmount)
  {
    m_envelopeAmount = envelopeAmount;
  }

  static int8_t clock(int8_t a, uint8_t k)
  {
    uint8_t cutoffFrequency = m_cutoffFrequency + highByte(m_envelopeAmount * (uint8_t) (k << (uint8_t) 1));
    if (cutoffFrequency & 0x80) {
      cutoffFrequency = 127;
    }

    const uint8_t* p = m_lpfTable + (uint16_t) (cutoffFrequency * (uint8_t) 4);
    int8_t b1OverA0 = pgm_read_byte(p++);
    int8_t b2OverA0 = pgm_read_byte(p++);
    int8_t a1OverA0 = pgm_read_byte(p++);
    int8_t a2OverA0 = pgm_read_byte(p++);

    int8_t x0 = a;
    int8_t y0 = highByte(((b2OverA0 * x0)   + (b1OverA0 * m_x1) + (b2OverA0 * m_x2) -
                          (a1OverA0 * m_y1) - (a2OverA0 * m_y2)) << 2);
    m_x2 = m_x1;
    m_y2 = m_y1;
    m_x1 = x0;
    m_y1 = y0;

    return y0;
  }
};

const uint8_t* VCF::m_lpfTable        = g_lpfTableQ1OverSqrt2;
uint8_t        VCF::m_cutoffFrequency = 127;
uint8_t        VCF::m_resonance       = 0;
uint8_t        VCF::m_envelopeAmount  = 0;
int8_t         VCF::m_x1              = 0;
int8_t         VCF::m_x2              = 0;
int8_t         VCF::m_y1              = 0;
int8_t         VCF::m_y2              = 0;
*/
