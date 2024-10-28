import { Result } from 'antd-mobile'
import './index.scss'
import { FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';

function ResultPage() {
  const navigate = useNavigate()

  return < div className='result-page'>
    <Result
      status='success'
      title={<FormattedMessage id='czcg' />}
      description={<div className='desc'>
        <div className='btn touch-btn' onClick={() => navigate('/my')}><FormattedMessage id='back' /></div>
        <div className='btn btn-detail touch-btn' onClick={() => navigate('/frens-detail?myself=1')}><FormattedMessage id='ckxq' /></div>
      </div>}
    />
  </div>
}

export default ResultPage;