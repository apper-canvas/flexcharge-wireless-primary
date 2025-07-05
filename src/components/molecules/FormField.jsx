import Input from '@/components/atoms/Input'
import Select from '@/components/atoms/Select'

const FormField = ({ type = 'input', step, ...props }) => {
  if (type === 'select') {
    return <Select {...props} />
  }
  
  if (type === 'textarea') {
    return <Input type="textarea" {...props} />
  }
  
  return <Input step={step} {...props} />
}

export default FormField