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
  Paper,
  styled
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
  options?: Array<{ id: string; field: string }>;
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

// 将 MyDrawer 定义移到组件外部
const MyDrawer = styled(Drawer)`
  & .MuiPaper-root .MuiBox-root .MuiButtonBase-root {
    width: unset;
  }
`;

// 将 TextField 组件抽离为独立组件
const SearchTextField = React.memo(({ 
  value, 
  onChange, 
  onClear, 
  onKeyDown,
  onSearch 
}: { 
  value: string; 
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; 
  onClear: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onSearch?: () => void;
}) => {
  const [isSearched, setIsSearched] = useState(false);
  
  // 处理搜索点击
  const handleSearchClick = () => {
    if (onSearch && value) {
      onSearch();
      // 设置为已搜索状态，这样会隐藏 CloseIcon 并恢复 SearchIcon 的背景色
      setIsSearched(true);
    }
  };
  
  // 修复清除功能
  const handleClearClick = () => {
    console.log('清除按钮被点击');
    // 直接调用外部传入的清除函数
    if (onClear) {
      onClear();
      // 重置搜索状态
      setIsSearched(false);
    }
  };
  
  // 当输入框内容变化时，重置搜索状态
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsSearched(false);
    onChange(e);
  };
  
  return (
    <TextField
      placeholder="Search Filter"
      variant="outlined"
      size="small"
      fullWidth
      value={value}
      autoComplete="off"
      name="filter-search"
      // 移除 type="search"，避免浏览器默认的清除按钮
      onKeyDown={onKeyDown}
      onChange={handleInputChange}
      onFocus={() => setIsSearched(false)}
      inputProps={{
        autoComplete: "off",
        form: {
          autoComplete: "off",
        },
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon fontSize="small" color="action" />
          </InputAdornment>
        ),
        endAdornment: (
          <>
            {value && !isSearched && (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={handleClearClick}
                  aria-label="清除搜索"
                  edge="end"
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            )}
            <InputAdornment position="end">
              <IconButton 
                size="small"
                color={value && !isSearched ? "primary" : "default"}
                onClick={handleSearchClick}
                disabled={!value}
                sx={{
                  backgroundColor: value && !isSearched ? 'primary.light' : 'transparent',
                  '&:hover': {
                    backgroundColor: value && !isSearched ? 'primary.main' : 'rgba(0, 0, 0, 0.04)',
                  },
                  '& .MuiSvgIcon-root': {
                    color: value && !isSearched ? 'white' : undefined
                  }
                }}
              >
                <SearchIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          </>
        ),
      }}
    />
  );
});

// 在 FilterDrawer 组件中
const FilterDrawer: React.FC<FilterDrawerProps> = ({ filters, onApply }) => {
  const [open, setOpen] = useState(false);
  const [filterValues, setFilterValues] = useState<Record<string, any>>({});
  const [expandedSelects, setExpandedSelects] = useState<Record<string, boolean>>({});
  const [selectedListItems, setSelectedListItems] = useState<Record<string, string[]>>({});
  
  // 搜索相关状态
  const [searchValue, setSearchValue] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // 生成搜索结果 - 添加防抖
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!searchValue.trim()) {
        setSearchResults([]);
        setShowSearchResults(false);
        return;
      }

      const results: SearchResultItem[] = [];
      const searchTerm = searchValue.toLowerCase();

      filters.forEach(filter => {
        if (filter.type === 'list' && filter.options) {
          filter.options.forEach(option => {
            if (option.field.toLowerCase().includes(searchTerm)) {
              results.push({
                filterField: filter.field,
                filterName: filter.headerName,
                optionId: option.id,
                optionName: option.field
              });
            }
          });
        }
      });

      setSearchResults(results);
      setShowSearchResults(true);
    }, 300); // 添加300ms防抖

    return () => clearTimeout(timer);
  }, [searchValue, filters]);

  // 处理搜索结果选择
  const handleSearchResultSelect = (result: SearchResultItem) => {
    // 只设置搜索框的值，不进行选择和展开操作
    setSearchValue(`${result.filterName}:${result.optionName}`);
    
    // 隐藏搜索结果
    setShowSearchResults(false);
    // 清空搜索结果数组，确保不会显示"NO result found"
    setSearchResults([]);
  };

  // 处理清除搜索框
  const handleClearSearch = () => {
    console.log('清除搜索框'); // 添加日志以便调试
    setSearchValue('');
    setShowSearchResults(false);
    setSearchResults([]);
  };

  // 添加搜索处理函数
  const handleSearch = () => {
    if (searchValue) {
      // 如果有搜索结果，使用第一个结果
      if (searchResults.length > 0) {
        const firstResult = searchResults[0];
        
        // 保存结果信息，用于后续操作
        const resultInfo = {
          filterField: firstResult.filterField,
          optionId: firstResult.optionId,
          filterName: firstResult.filterName,
          optionName: firstResult.optionName
        };
        
        // 隐藏搜索结果
        setShowSearchResults(false);
        // 清空搜索结果数组，确保不会显示"NO result found"
        setSearchResults([]);
        
        // 设置搜索框的值为选中项的名称
        setSearchValue(`${resultInfo.filterName}:${resultInfo.optionName}`);
        
        // 修改：检查是否已经选中，如果已选中则不执行取消操作
        const currentSelected = selectedListItems[resultInfo.filterField] || [];
        if (!currentSelected.includes(resultInfo.optionId)) {
          // 只有未选中时才添加到选中列表
          const newSelected = [...currentSelected, resultInfo.optionId];
          
          setSelectedListItems({
            ...selectedListItems,
            [resultInfo.filterField]: newSelected
          });
          
          setFilterValues({
            ...filterValues,
            [resultInfo.filterField]: newSelected
          });
        }
        
        // 添加日志以便调试
        console.log('选中项:', resultInfo.filterField, resultInfo.optionId);
        console.log('当前选中状态:', selectedListItems);
      } 
      // 如果没有搜索结果但有搜索值，尝试解析搜索值
      else if (searchValue.includes(':')) {
        const [filterName, optionName] = searchValue.split(':').map(s => s.trim());
        
        // 查找匹配的筛选项和选项
        const matchedFilter = filters.find(f => f.headerName === filterName);
        if (matchedFilter && matchedFilter.type === 'list' && matchedFilter.options) {
          const matchedOption = matchedFilter.options.find(o => o.field === optionName);
          if (matchedOption) {
            // 修改：检查是否已经选中，如果已选中则不执行取消操作
            const currentSelected = selectedListItems[matchedFilter.field] || [];
            if (!currentSelected.includes(matchedOption.id)) {
              // 只有未选中时才添加到选中列表
              const newSelected = [...currentSelected, matchedOption.id];
              
              setSelectedListItems({
                ...selectedListItems,
                [matchedFilter.field]: newSelected
              });
              
              setFilterValues({
                ...filterValues,
                [matchedFilter.field]: newSelected
              });
            }
            
            // 添加日志以便调试
            console.log('通过解析选中项:', matchedFilter.field, matchedOption.id);
            console.log('当前选中状态:', selectedListItems);
          }
        }
      }
    }
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
    setSearchValue('');
    setShowSearchResults(false);
    setSearchResults([]);
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
    const newExpandedState: Record<string, boolean> = {};
    
    Object.keys(expandedSelects).forEach(key => {
      newExpandedState[key] = false;
    });
    
    newExpandedState[field] = !expandedSelects[field];
    
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
    const values: Record<string, any> = {};
    
    Object.keys(filterValues).forEach(key => {
      if (filterValues[key] !== null && filterValues[key] !== undefined && filterValues[key] !== '') {
        const filter = filters.find(f => f.field === key);
        if (filter?.type === 'date' && filterValues[key]) {
          values[key] = dayjs(filterValues[key]).format('YYYY-MM-DD');
        } else {
          values[key] = filterValues[key];
        }
      }
    });
    
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
  const renderListOptions = (filterField: string, options: Array<{ id: string; field: string }>) => {
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
                <ListItemText primary={option.field} />
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
                toggleListExpand(filterField);
              }}
            >
              {isExpanded ? '收起' : '更多'}
            </Button>
          </Box>
        )}
      </List>
    );
  };

  // 渲染搜索结果
  const renderSearchResults = () => {
    // 如果不显示搜索结果或搜索值为空，直接返回null
    if (!showSearchResults || searchValue.length === 0) {
      return null;
    }
    
    // 检查是否是已选中的项（包含冒号）
    const isSelectedItem = searchValue.includes(':');
    
    // 检查是否是未修改的选中项
    let isUnmodifiedSelectedItem = false;
    
    if (isSelectedItem) {
      const [filterName, optionName] = searchValue.split(':').map(s => s.trim());
      
      // 查找匹配的筛选项
      const matchedFilter = filters.find(f => f.headerName === filterName);
      if (matchedFilter && matchedFilter.type === 'list' && matchedFilter.options) {
        // 查找匹配的选项
        const matchedOption = matchedFilter.options.find(o => o.field === optionName);
        
        // 如果选项存在且未被修改，则设置为未修改的选中项
        if (matchedOption) {
          isUnmodifiedSelectedItem = true;
        }
      }
    }
    
    // 当有搜索结果时显示结果列表，否则在选中项被修改的情况下显示"无结果"提示
    return (
      <Paper 
        elevation={3} 
        sx={{ 
          mt: 1, 
          maxHeight: 300, 
          overflow: 'auto',
          position: 'absolute',
          width: 'calc(100% - 48px)',
          zIndex: 1000
        }}
      >
        {searchResults.length > 0 ? (
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
        ) : (
          // 修改条件：当没有搜索结果且（不是选中项或选中项被修改）时显示"未找到匹配结果"
          (!isSelectedItem || (isSelectedItem && !isUnmodifiedSelectedItem)) && (
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                No result found
              </Typography>
            </Box>
          )
        )}
      </Paper>
    );
  };

  return (
    <>
      <Button 
        variant="outlined" 
        startIcon={<FilterListIcon />} 
        onClick={handleOpen}
      >
        筛选
      </Button>

      <MyDrawer
        anchor="right"
        open={open}
        onClose={handleClose}
        disableRestoreFocus
        keepMounted
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
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <IconButton onClick={handleClose} edge="end">
              <CloseIcon />
            </IconButton>
          </Box>
    
          <Box sx={{ mb: 2, position: 'relative' }}>
            <SearchTextField 
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onClear={handleClearSearch} // 确保这里正确传递了清除函数
              onKeyDown={(e) => e.stopPropagation()}
              onSearch={handleSearch}
            />
            {renderSearchResults()}
          </Box>

          <Box sx={{ 
            flex: 1, 
            overflowY: 'auto',
            pr: 1,
            mr: -1
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
      </MyDrawer>
    </>
  );
};

export default FilterDrawer;