import { styled } from '@src/stitches.config'
import React from 'react'
import Select from 'react-select'

const Group = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
})
const GroupBadge = styled('span', {
  backgroundColor: '#EBECF0',
  borderRadius: '2em',
  color: '#172B4D',
  display: 'inline-block',
  fontSize: 12,
  fontWeight: 'normal',
  lineHeight: '1',
  minWidth: 1,
  padding: '0.16666666666667em 0.5em',
  textAlign: 'center',
})

const formatGroupLabel = (data:any) => (
  <Group>
    <span>{data.label}</span>
    <GroupBadge>{data.options.length}</GroupBadge>
  </Group>
)

export const ShortcutSelect = ({ value, setValue, shortcuts }: { value: string, setValue: (e: string) => void, shortcuts: Shortcut[]}) => {
  const shortcutList: { label: string, options: { value: string, label: string}[] }[] = []

  for (let shortcut of shortcuts) {
    const categoryId = shortcutList.findIndex(s => s.label === shortcut.category)
    
    const formattedShortcut = {
      value: [shortcut.category, shortcut.name].join(' > '),
      label: shortcut.name
    }
    if (categoryId >= 0) {
      shortcutList[categoryId].options.push(formattedShortcut)
    } else {
      shortcutList.push({
        label: shortcut.category,
        options: [ formattedShortcut ]
      })
    }
  }


  const styles = {
    container: (styles:any) => ({ ...styles, width: '100%', outline: 'gray' }),
    option: (styles: any, state: any) => {
      return {
        ...styles, 
        color: 'gray', 
        ...state.isSelected ? {
          backgroundColor: 'lightgray'
        } : {
          backgroundColor: 'white'
        },
        ...state.isFocused ? {
          color: 'white',
          backgroundColor: 'lightgray'
        } : {}
      }
    },
    control: (styles:any) => {
      return { 
        ...styles, 
        borderColor: 'gray', 
        boxShadow: 'none', 
        '&:hover': { 
          borderColor: 'gray' 
        } }
    }
  }

  const onChange = (item:any) => {
    if (item === null) {
      setValue('')
    } else {
      setValue(item.value)
    }
  }

  const item = {
    value: value,
    label: value.split(' > ')[1]
  }

  return <Select isClearable onChange={onChange} styles={styles} defaultValue={item}
    options={shortcutList}
    formatGroupLabel={formatGroupLabel} />
}