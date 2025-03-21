import React, { useState } from 'react';
import { 
  Button, 
  Drawer, 
  Box, 
  IconButton, 
  Typography, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel,
  SelectChangeEvent,
  Stack,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Checkbox,
  Collapse,
  OutlinedInput
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CloseIcon from '@mui/icons-material/Close';
import FilterListIcon from '@mui/icons-material/FilterList';
import CheckIcon from '@mui/icons-material/Check';
import { DatePicker, StaticDatePicker } from '@mui/x-date-pickers/';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

// 筛选项类型定义
interface FilterOption {
  id: string;
  label: string;
  type: 'date' | 'list';
  options?: Array<{ value: string; label: string }>;
  listOptions?: Array<{ id: string; label: string }>;
}

interface FilterDrawerProps {
  filters: FilterOption[];
  onApply: (values: Record<string, any>) => void;
}

const FilterDrawer: React.FC<FilterDrawerProps> = ({ filters, onApply }) => {
  const [open, setOpen] = useState(false);
  const [filterValues, setFilterValues] = useState<Record<string, any>>({});
  const [expandedSelects, setExpandedSelects] = useState<Record<string, boolean>>({});
  const [selectedListItems, setSelectedListItems] = useState<Record<string, string[]>>({});

  // 打开抽屉
  const handleOpen = () => {
    setOpen(true);
  };

  // 关闭抽屉
  const handleClose = () => {
    setOpen(false);
    // 重置所有状态到默认值
    setFilterValues({});
    setExpandedSelects({});
    setSelectedListItems({});
  };

  // 处理日期选择器变化
  const handleDateChange = (id: string, date: any) => {
    setFilterValues({
      ...filterValues,
      [id]: date
    });
  };

  // 处理列表项选择
  const handleListItemToggle = (filterId: string, itemId: string) => {
    const currentSelected = selectedListItems[filterId] || [];
    const newSelected = currentSelected.includes(itemId)
      ? currentSelected.filter(id => id !== itemId)
      : [...currentSelected, itemId];
    
    setSelectedListItems({
      ...selectedListItems,
      [filterId]: newSelected
    });
    
    setFilterValues({
      ...filterValues,
      [filterId]: newSelected
    });
  };

  // 切换选择框展开/折叠状态
  const toggleExpand = (id: string) => {
    // 创建新的展开状态对象
    const newExpandedState: Record<string, boolean> = {};
    
    // 将所有列表项设置为折叠状态
    Object.keys(expandedSelects).forEach(key => {
      newExpandedState[key] = false;
    });
    
    // 只设置当前点击的项为展开状态（如果之前是折叠的）
    // 如果之前是展开的，则保持折叠状态
    newExpandedState[id] = !expandedSelects[id];
    
    // 更新状态
    setExpandedSelects(newExpandedState);
  };

  // 切换列表选项展开/折叠状态
  const toggleListExpand = (id: string) => {
    const listId = `list_${id}`;
    setExpandedSelects({
      ...expandedSelects,
      [listId]: !expandedSelects[listId]
    });
  };

  // 应用筛选条件
  const handleApply = () => {
    // 收集所有筛选值
    const values: Record<string, any> = {};
    
    // 收集选择框和日期选择器的值
    Object.keys(filterValues).forEach(key => {
      if (filterValues[key] !== null && filterValues[key] !== undefined && filterValues[key] !== '') {
        // 对于日期类型，转换为标准格式字符串
        const filter = filters.find(f => f.id === key);
        if (filter?.type === 'date' && filterValues[key]) {
          values[key] = dayjs(filterValues[key]).format('YYYY-MM-DD');
        } else {
          values[key] = filterValues[key];
        }
      }
    });
    
    // 收集列表选择项的值
    Object.keys(selectedListItems).forEach(key => {
      if (selectedListItems[key] && selectedListItems[key].length > 0) {
        values[key] = selectedListItems[key];
      }
    });
    
    console.log('应用的筛选条件:', values);
    onApply(values);
    handleClose();
  };


  // 渲染列表选项
  const renderListOptions = (filterId: string, options: Array<{ id: string; label: string }>) => {
    const isExpanded = expandedSelects[`list_${filterId}`] || false;
    const showMoreButton = options.length > 10;
    const displayOptions = showMoreButton && !isExpanded ? options.slice(0, 10) : options;
    const selected = selectedListItems[filterId] || [];

    return (
      <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
        {displayOptions.map((option) => {
          const isItemSelected = selected.indexOf(option.id) !== -1;
          
          return (
            <ListItem key={option.id} disablePadding>
              <ListItemButton 
                dense
                onClick={() => handleListItemToggle(filterId, option.id)}
              >
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={isItemSelected}
                    tabIndex={-1}
                    disableRipple
                  />
                </ListItemIcon>
                <ListItemText primary={option.label} />
              </ListItemButton>
            </ListItem>
          );
        })}
        
        {showMoreButton && (
          <Box sx={{ textAlign: 'right', p: 1 }}>
            <Button 
              size="small" 
              onClick={(e) => {
                e.stopPropagation();
                toggleListExpand(filterId);
              }}
            >
              {isExpanded ? '收起' : '更多'}
            </Button>
          </Box>
        )}
      </List>
    );
  };

  return (
    <>
      {/* 筛选按钮 */}
      <Button 
        variant="outlined" 
        startIcon={<FilterListIcon />} 
        onClick={handleOpen}
      >
        筛选
      </Button>

      {/* 筛选抽屉 */}
      <Drawer
        anchor="right"
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            maxHeight: '100vh',
            height: '100%',
            overflow: 'hidden'
          }
        }}
      >
        <Box sx={{ 
          width: 320, 
          p: 3, 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          {/* 顶部区域 */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <IconButton onClick={handleClose} edge="end">
              <CloseIcon />
            </IconButton>
          </Box>

          {/* 内容区域 */}
          <Box sx={{ 
            flex: 1, 
            overflowY: 'auto',
            pr: 1, // 添加右侧内边距，避免滚动条与内容太近
            mr: -1 // 负外边距抵消内边距对宽度的影响
          }}>
            <Stack spacing={3}>
              {filters.map((filter) => (
                <Box key={filter.id}>
                    <Box>
                      <Typography 
                        variant="subtitle1" 
                        gutterBottom
                        sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center',
                          cursor: 'pointer',
                          '&:hover': { color: 'primary.main' }
                        }}
                        onClick={() => toggleExpand(filter.id)}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {expandedSelects[filter.id] ? <ExpandMoreIcon fontSize="small" /> : <ChevronRightIcon fontSize="small" />}
                          {filter.label}
                          {filter.type === 'date' && filterValues[filter.id] && (
                            <Typography 
                              component="span" 
                              variant="body2" 
                              color="primary.main" 
                              sx={{ ml: 1, display: 'flex', alignItems: 'center' }}
                            >
                              <CheckIcon fontSize="small" />
                            </Typography>
                          )}
                          {selectedListItems[filter.id]?.length > 0 && (
                            <Typography 
                              component="span" 
                              variant="body2" 
                              color="primary.main" 
                              sx={{ ml: 1 }}
                            >
                              ({selectedListItems[filter.id]?.length})
                            </Typography>
                          )}
                        </Box>
                        
                      </Typography>
                      <Collapse in={expandedSelects[filter.id] === true}>
                      {filter.type === 'date' && (
                          <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, mt: 1 }}>
                              <Typography variant="body2" sx={{ flex: 1 }}>
                                {filterValues[filter.id] ? dayjs(filterValues[filter.id]).format('YYYY-MM-DD') : 'MM/DD/YYYY'}
                              </Typography>
                              {filterValues[filter.id] && (
                                <IconButton 
                                  size="small" 
                                  onClick={() => handleDateChange(filter.id, null)}
                                  sx={{ p: 0.5 }}
                                >
                                  <CloseIcon fontSize="small" />
                                </IconButton>
                              )}
                            </Box>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <StaticDatePicker
                                displayStaticWrapperAs="desktop"
                                value={filterValues[filter.id] || null}
                                onChange={(date) => handleDateChange(filter.id, date)}
                                slotProps={{
                                  actionBar: {
                                    actions: ['clear'],
                                  },
                                }}
                              />
                            </LocalizationProvider>
                          </Box>
                      )}
                        {
                          filter.type === 'list' && filter.listOptions && (
                            renderListOptions(filter.id, filter.listOptions)
                          )
                        }
                       
                      </Collapse>
                    </Box>
                  
                </Box>
              ))}
            </Stack>
          </Box>

          {/* 底部操作区 */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleApply}
            >
              应用
            </Button>
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default FilterDrawer;