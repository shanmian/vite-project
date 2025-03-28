import React, { useState, useEffect } from 'react';
import { 
  Button, 
  Drawer, 
  Box, 
  IconButton, 
  Typography, 
  Stack,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Checkbox,
  Collapse,
  TextField,
  InputAdornment,
  Autocomplete,
  Paper
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CloseIcon from '@mui/icons-material/Close';
import FilterListIcon from '@mui/icons-material/FilterList';
import CheckIcon from '@mui/icons-material/Check';
import SearchIcon from '@mui/icons-material/Search';
import { DatePicker, StaticDatePicker } from '@mui/x-date-pickers/';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

// 筛选项类型定义
interface FilterOption {
  field: string;
  headerName: string;
  type: 'date' | 'list';
  options?: Array<{ id: string; field: string }>;  // 修改这里，使用 field 而不是 headerName
}

interface FilterDrawerProps {
  filters: FilterOption[];
  onApply: (values: Record<string, any>) => void;
}

// 搜索结果项类型
interface SearchResultItem {
  filterField: string;
  filterName: string;
  optionId: string;
  optionName: string;
}

const FilterDrawer: React.FC<FilterDrawerProps> = ({ filters, onApply }) => {
  const [open, setOpen] = useState(false);
  const [filterValues, setFilterValues] = useState<Record<string, any>>({});
  const [expandedSelects, setExpandedSelects] = useState<Record<string, boolean>>({});
  const [selectedListItems, setSelectedListItems] = useState<Record<string, string[]>>({});
  
  // 搜索相关状态
  const [searchValue, setSearchValue] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);

  // 生成搜索结果
  useEffect(() => {
    if (!searchValue.trim()) {
      setSearchResults([]);
      return;
    }

    const results: SearchResultItem[] = [];
    const searchTerm = searchValue.toLowerCase();

    filters.forEach(filter => {
      if (filter.type === 'list' && filter.options) {
        filter.options.forEach(option => {
          if (option.field.toLowerCase().includes(searchTerm)) {  // 修改这里，使用 field 而不是 headerName
            results.push({
              filterField: filter.field,
              filterName: filter.headerName,
              optionId: option.id,
              optionName: option.field  // 修改这里，使用 field 而不是 headerName
            });
          }
        });
      }
    });

    setSearchResults(results);
  }, [searchValue, filters]);

  // 处理搜索结果选择
  const handleSearchResultSelect = (result: SearchResultItem) => {
    handleListItemToggle(result.filterField, result.optionId);
    
    // 展开对应的筛选项
    // toggleExpand(result.filterField);
    
    // 清空搜索框
    setSearchValue('');
  };

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
  const handleDateChange = (field: string, date: any) => {
    setFilterValues({
      ...filterValues,
      [field]: date
    });
  };

  // 处理列表项选择
  const handleListItemToggle = (filterField: string, itemId: string) => {
    const currentSelected = selectedListItems[filterField] || [];
    const newSelected = currentSelected.includes(itemId)
      ? currentSelected.filter(id => id !== itemId)
      : [...currentSelected, itemId];
    
    setSelectedListItems({
      ...selectedListItems,
      [filterField]: newSelected
    });
    
    setFilterValues({
      ...filterValues,
      [filterField]: newSelected
    });
  };

  // 切换选择框展开/折叠状态
  const toggleExpand = (field: string) => {
    // 创建新的展开状态对象
    const newExpandedState: Record<string, boolean> = {};
    
    // 将所有列表项设置为折叠状态
    Object.keys(expandedSelects).forEach(key => {
      newExpandedState[key] = false;
    });
    
    // 只设置当前点击的项为展开状态（如果之前是折叠的）
    // 如果之前是展开的，则保持折叠状态
    newExpandedState[field] = !expandedSelects[field];
    
    // 更新状态
    setExpandedSelects(newExpandedState);
  };

  // 切换列表选项展开/折叠状态
  const toggleListExpand = (field: string) => {
    const listId = `list_${field}`;
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
        const filter = filters.find(f => f.field === key);
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
  const renderListOptions = (filterField: string, options: Array<{ id: string; field: string }>) => {  // 修改这里，使用 field 而不是 headerName
    const isExpanded = expandedSelects[`list_${filterField}`] || false;
    const showMoreButton = options.length > 10;
    const displayOptions = showMoreButton && !isExpanded ? options.slice(0, 10) : options;
    const selected = selectedListItems[filterField] || [];

    return (
      <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
        {displayOptions.map((option) => {
          const isItemSelected = selected.indexOf(option.id) !== -1;
          
          return (
            <ListItem key={option.id} disablePadding>
              <ListItemButton 
                dense
                onClick={() => handleListItemToggle(filterField, option.id)}
              >
                <ListItemText primary={option.field} />  {/* 修改这里，使用 field 而不是 headerName */}
                {isItemSelected && (
                  <CheckIcon color="primary" fontSize="small" />
                )}
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
                toggleListExpand(filterField);  // 修改这里，使用 filterField 而不是 filterId
              }}
            >
              {isExpanded ? '收起' : '更多'}
            </Button>
          </Box>
        )}
      </List>
    );
  };
  const top100Films = [
    { label: 'The Shawshank Redemption', headerName: 1994 },
    { label: 'The Godfather', headerName: 1972 },
    { label: 'The Godfather: Part II', headerName: 1974 },
    { label: 'The Dark Knight', headerName: 2008 },
    { label: '12 Angry Men', headerName: 1957 },
    { label: "Schindler's List", headerName: 1993 },
    { label: 'Pulp Fiction', headerName: 1994 },]
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
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <IconButton onClick={handleClose} edge="end">
              <CloseIcon />
            </IconButton>
          </Box>
          <Autocomplete
      disablePortal
      options={top100Films}
      sx={{ width: 300 }}
      renderInput={(params) => <TextField {...params} label="Movie" />}
    />
          {/* 搜索框 */}
          <Box sx={{ mb: 2 }}>
            <TextField
              placeholder="Search Filter"
              variant="outlined"
              size="small"
              fullWidth
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              InputProps={{
                endAdornment: (
                  <>
                    {searchValue ? (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={() => setSearchValue('')}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    ) : null}
                    <InputAdornment position="end">
                      <IconButton 
                        size="small"
                        color={searchValue ? "primary" : "default"}
                      >
                        <SearchIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  </>
                ),
              }}
            />
            
            {/* 搜索结果列表 */}
            {searchValue.length > 0 && searchResults.length > 0 && (
              <Paper 
                elevation={3} 
                sx={{ 
                  mt: 1, 
                  maxHeight: 300, 
                  overflow: 'auto',
                  position: 'absolute',
                  width: 'calc(100% - 48px)', // 减去左右padding
                  zIndex: 1000
                }}
              >
                <List dense>
                  {searchResults.map((result, index) => (
                    <ListItem 
                      key={`${result.filterField}-${result.optionId}-${index}`}
                      disablePadding
                    >
                      <ListItemButton 
                        onClick={() => {
                          handleSearchResultSelect(result);
                        }}
                      >
                        <ListItemText 
                          primary={
                            <Box>
                              <Typography variant="body2" component="span" sx={{ fontWeight: 'bold' }}>
                                {result.filterName}:
                              </Typography>{' '}
                              <Typography variant="body2" component="span">
                                {result.optionName}
                              </Typography>
                            </Box>
                          } 
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Paper>
            )}
            
            {/* 无搜索结果提示 */}
            {searchValue.length > 0 && searchResults.length === 0 && (
              <Paper 
                elevation={3} 
                sx={{ 
                  mt: 1, 
                  p: 2, 
                  textAlign: 'center',
                  position: 'absolute',
                  width: 'calc(100% - 48px)', // 减去左右padding
                  zIndex: 1000
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  NO result found
                </Typography>
              </Paper>
            )}
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
                <Box key={filter.field}>
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
                        onClick={() => toggleExpand(filter.field)}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {expandedSelects[filter.field] ? <ExpandMoreIcon fontSize="small" /> : <ChevronRightIcon fontSize="small" />}
                          {filter.headerName}
                          {filter.type === 'date' && filterValues[filter.field] && (
                            <Typography 
                              component="span" 
                              variant="body2" 
                              color="primary.main" 
                              sx={{ ml: 1, display: 'flex', alignItems: 'center' }}
                            >
                              <CheckIcon fontSize="small" />
                            </Typography>
                          )}
                          {selectedListItems[filter.field]?.length > 0 && (
                            <Typography 
                              component="span" 
                              variant="body2" 
                              color="primary.main" 
                              sx={{ ml: 1 }}
                            >
                              ({selectedListItems[filter.field]?.length})
                            </Typography>
                          )}
                        </Box>
                        
                      </Typography>
                      <Collapse in={expandedSelects[filter.field] === true}>
                      {filter.type === 'date' && (
                          <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, mt: 1 }}>
                              <Typography variant="body2" sx={{ flex: 1 }}>
                                {filterValues[filter.field] ? dayjs(filterValues[filter.field]).format('YYYY-MM-DD') : 'MM/DD/YYYY'}
                              </Typography>
                              {filterValues[filter.field] && (
                                <IconButton 
                                  size="small" 
                                  onClick={() => handleDateChange(filter.field, null)}
                                  sx={{ p: 0.5 }}
                                >
                                  <CloseIcon fontSize="small" />
                                </IconButton>
                              )}
                            </Box>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <StaticDatePicker
                                displayStaticWrapperAs="desktop"
                                value={filterValues[filter.field] || null}
                                onChange={(date) => handleDateChange(filter.field, date)}
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
                          filter.type === 'list' && filter.options && (
                            renderListOptions(filter.field, filter.options)
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