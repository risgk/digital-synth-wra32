var EG = function() {
  this.clock = function() {
    return 1;
  }
}
/*
class EG
{
  static const uint8_t STATE_ATTACK  = 0;
  static const uint8_t STATE_DECAY   = 1;
  static const uint8_t STATE_SUSTAIN = 2;
  static const uint8_t STATE_RELEASE = 3;
  static const uint8_t STATE_IDLE    = 4;

  static uint8_t  m_attackSpeed;
  static uint8_t  m_decaySpeed;
  static uint8_t  m_sustainLevel;
  static uint8_t  m_state;
  static uint16_t m_count;
  static int8_t   m_level;

public:
  static void setAttackTime(uint8_t attackTime)
  {
    m_attackSpeed = *(g_envTableSpeedFromTime + attackTime);
  }

  static void setDecayTime(uint8_t decayTime)
  {
    m_decaySpeed = *(g_envTableSpeedFromTime + decayTime);
  }

  static void setSustainLevel(uint8_t sustainLevel)
  {
    m_sustainLevel = sustainLevel;
  }

  static void noteOn()
  {
    m_state = STATE_ATTACK;
    m_count = *(g_envTableAttackInverse + m_level) << 8;
  }

  static void noteOff()
  {
    m_state = STATE_RELEASE;
    m_count = *(g_envTableDecayInverse + m_level) << 8;
  }

  static void soundOff()
  {
    m_state = STATE_IDLE;
  }

  static uint8_t clock()
  {
    switch (m_state) {
    case STATE_ATTACK:
      m_count += m_attackSpeed;
      m_level = *(g_envTableAttack + highByte(m_count));
      if (highByte(m_count) == (uint8_t) 255) {
        m_state = STATE_DECAY;
        m_count = 0;
      }
      break;
    case STATE_DECAY:
      m_count += m_decaySpeed;
      m_level = *(g_envTableDecay + highByte(m_count));
      if (m_level <= m_sustainLevel) {
        m_state = STATE_SUSTAIN;
        m_level = m_sustainLevel;
      }
      break;
    case STATE_SUSTAIN:
      m_level = m_sustainLevel;
      break;
    case STATE_RELEASE:
      m_count += m_decaySpeed;
      m_level = *(g_envTableDecay + highByte(m_count));
      if (highByte(m_count) == (uint8_t) 255) {
        m_state = STATE_IDLE;
      }
      break;
    case STATE_IDLE:
      m_level = 0;
      break;
    }

    return m_level;
  }
};

uint8_t  EG::m_attackSpeed  = 255;
uint8_t  EG::m_decaySpeed   = 255;
uint8_t  EG::m_sustainLevel = 127;
uint8_t  EG::m_state        = STATE_IDLE;
uint16_t EG::m_count        = 0;
int8_t   EG::m_level        = 0;
*/
