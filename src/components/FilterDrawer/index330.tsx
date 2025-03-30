import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
  ListItemText,
  Collapse,
  TextField,
  InputAdornment,
  Paper,
  styled
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CloseIcon from '@mui/icons-material/Close';
import FilterListIcon from '@mui/icons-material/FilterList';
import CheckIcon from '@mui/icons-material/Check';
import SearchIcon from '@mui/icons-material/Search';
import { StaticDatePicker } from '@mui/x-date-pickers/';
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
  weight?: number;
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
  const handleSearchClick = useCallback(() => {
    if (onSearch && value) {
      onSearch();
      setIsSearched(true);
    }
  }, [onSearch, value]);
  
  // 处理清除功能
  const handleClearClick = useCallback(() => {
    if (onClear) {
      onClear();
      setIsSearched(false);
    }
  }, [onClear]);
  
  // 当输入框内容变化时，重置搜索状态
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setIsSearched(false);
    onChange(e);
  }, [onChange]);
  
  return (
    <TextField
      placeholder="Search Filter"
      variant="outlined"
      size="small"
      fullWidth
      value={value}
      autoComplete="off"
      name="filter-search"
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

// 日期选择器组件
const DatePickerField = React.memo(({ 
  field, 
  value, 
  onChange 
}: { 
  field: string; 
  value: any;
  onChange: (field: string, date: any) => void;
}) => (
  <Box>
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, mt: 1 }}>
      <Typography variant="body2" sx={{ flex: 1 }}>
        {value ? dayjs(value).format('YYYY-MM-DD') : 'MM/DD/YYYY'}
      </Typography>
      {value && (
        <IconButton 
          size="small" 
          onClick={() => onChange(field, null)}
          sx={{ p: 0.5 }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      )}
    </Box>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <StaticDatePicker
        displayStaticWrapperAs="desktop"
        value={value || null}
        onChange={(date) => onChange(field, date)}
        slotProps={{
          actionBar: {
            actions: ['clear'],
          },
        }}
      />
    </LocalizationProvider>
  </Box>
));

// 列表选项组件
const FilterListOptions = React.memo(({ 
  filterField, 
  options,
  expandedSelects,
  selectedListItems,
  onItemToggle,
  onListExpand
}: { 
  filterField: string; 
  options: Array<{ id: string; field: string }>;
  expandedSelects: Record<string, boolean>;
  selectedListItems: Record<string, string[]>;
  onItemToggle: (filterField: string, itemId: string) => void;
  onListExpand: (field: string) => void;
}) => {
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
              onClick={() => onItemToggle(filterField, option.id)}
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
              onListExpand(filterField);
            }}
          >
            {isExpanded ? '收起' : '更多'}
          </Button>
        </Box>
      )}
    </List>
  );
});

// FilterDrawer 组件
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
            const fieldLower = option.field.toLowerCase();
            const isStartsWith = fieldLower.startsWith(searchTerm);
            const isIncludes = fieldLower.includes(searchTerm);
            
            if (isStartsWith || isIncludes) {
              results.push({
                filterField: filter.field,
                filterName: filter.headerName,
                optionId: option.id,
                optionName: option.field,
                weight: isStartsWith ? 2 : 1
              });
            }
          });
        }
      });

      // 按权重排序，优先显示以搜索词开头的选项
      setSearchResults(results.sort((a, b) => (b.weight || 0) - (a.weight || 0)));
      setShowSearchResults(true);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchValue, filters]);

  // 处理搜索结果选择
  const handleSearchResultSelect = useCallback((result: SearchResultItem) => {
    setSearchValue(`${result.filterName}:${result.optionName}`);
    setShowSearchResults(false);
    setSearchResults([]);
  }, []);

  // 处理清除搜索框
  const handleClearSearch = useCallback(() => {
    setSearchValue('');
    setShowSearchResults(false);
    setSearchResults([]);
  }, []);

  // 添加搜索处理函数
  const handleSearch = useCallback(() => {
    if (searchValue) {
      // 如果有搜索结果，使用第一个结果
      if (searchResults.length > 0) {
        const firstResult = searchResults[0];
        
        // 保存结果信息
        const resultInfo = {
          filterField: firstResult.filterField,
          optionId: firstResult.optionId,
          filterName: firstResult.filterName,
          optionName: firstResult.optionName
        };
        
        setShowSearchResults(false);
        setSearchResults([]);
        setSearchValue(`${resultInfo.filterName}:${resultInfo.optionName}`);
        
        // 检查是否已经选中
        const currentSelected = selectedListItems[resultInfo.filterField] || [];
        if (!currentSelected.includes(resultInfo.optionId)) {
          const newSelected = [...currentSelected, resultInfo.optionId];
          
          setSelectedListItems(prev => ({
            ...prev,
            [resultInfo.filterField]: newSelected
          }));
          
          setFilterValues(prev => ({
            ...prev,
            [resultInfo.filterField]: newSelected
          }));
        }
      } 
      // 如果没有搜索结果但有搜索值，尝试解析搜索值
      else if (searchValue.includes(':')) {
        const [filterName, optionName] = searchValue.split(':').map(s => s.trim());
        
        // 查找匹配的筛选项和选项
        const matchedFilter = filters.find(f => f.headerName === filterName);
        if (matchedFilter && matchedFilter.type === 'list' && matchedFilter.options) {
          const matchedOption = matchedFilter.options.find(o => o.field === optionName);
          if (matchedOption) {
            const currentSelected = selectedListItems[matchedFilter.field] || [];
            if (!currentSelected.includes(matchedOption.id)) {
              const newSelected = [...currentSelected, matchedOption.id];
              
              setSelectedListItems(prev => ({
                ...prev,
                [matchedFilter.field]: newSelected
              }));
              
              setFilterValues(prev => ({
                ...prev,
                [matchedFilter.field]: newSelected
              }));
            }
          }
        }
      }
    }
  }, [searchValue, searchResults, selectedListItems, filters]);

  // 打开抽屉
  const handleOpen = useCallback(() => {
    setOpen(true);
  }, []);

  // 关闭抽屉
  const handleClose = useCallback(() => {
    setOpen(false);
    // 重置所有状态到默认值
    setFilterValues({});
    setExpandedSelects({});
    setSelectedListItems({});
    setSearchValue('');
    setShowSearchResults(false);
    setSearchResults([]);
  }, []);

  // 处理日期选择器变化
  const handleDateChange = useCallback((field: string, date: any) => {
    setFilterValues(prev => ({
      ...prev,
      [field]: date
    }));
  }, []);

  // 处理列表项选择
  const handleListItemToggle = useCallback((filterField: string, itemId: string) => {
    setSelectedListItems(prev => {
      const currentSelected = prev[filterField] || [];
      const newSelected = currentSelected.includes(itemId)
        ? currentSelected.filter(id => id !== itemId)
        : [...currentSelected, itemId];
      
      return {
        ...prev,
        [filterField]: newSelected
      };
    });
    
    setFilterValues(prev => {
      const currentSelected = prev[filterField] || [];
      const newSelected = Array.isArray(currentSelected) && currentSelected.includes(itemId)
        ? currentSelected.filter(id => id !== itemId)
        : [...(Array.isArray(currentSelected) ? currentSelected : []), itemId];
      
      return {
        ...prev,
        [filterField]: newSelected
      };
    });
  }, []);

  // 切换选择框展开/折叠状态
  const toggleExpand = useCallback((field: string) => {
    setExpandedSelects(prev => {
      const newExpandedState: Record<string, boolean> = {};
      
      Object.keys(prev).forEach(key => {
        newExpandedState[key] = false;
      });
      
      newExpandedState[field] = !prev[field];
      
      return newExpandedState;
    });
  }, []);

  // 切换列表选项展开/折叠状态
  const toggleListExpand = useCallback((field: string) => {
    const listId = `list_${field}`;
    setExpandedSelects(prev => ({
      ...prev,
      [listId]: !prev[listId]
    }));
  }, []);

  // 应用筛选条件
  const handleApply = useCallback(() => {
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
    
    onApply(values);
    handleClose();
  }, [filterValues, onApply, handleClose, filters]);

  // 渲染搜索结果
  const renderSearchResults = useCallback(() => {
    if (!showSearchResults || searchValue.length === 0) {
      return null;
    }
    
    // 检查是否是已选中的项
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
        
        if (matchedOption) {
          isUnmodifiedSelectedItem = true;
        }
      }
    }
    
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
          (!isSelectedItem || (isSelectedItem && !isUnmodifiedSelectedItem)) && (
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                未找到匹配结果
              </Typography>
            </Box>
          )
        )}
      </Paper>
    );
  }, [searchResults, searchValue, filters, showSearchResults, handleSearchResultSelect]);

  // 使用 useMemo 优化过滤器列表渲染
  const filtersList = useMemo(() => (
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
                <DatePickerField 
                  field={filter.field} 
                  value={filterValues[filter.field]}
                  onChange={handleDateChange}
                />
              )}
              {
                filter.type === 'list' && filter.options && (
                  <FilterListOptions 
                    filterField={filter.field} 
                    options={filter.options}
                    expandedSelects={expandedSelects}
                    selectedListItems={selectedListItems}
                    onItemToggle={handleListItemToggle}
                    onListExpand={toggleListExpand}
                  />
                )
              }
            </Collapse>
          </Box>
        </Box>
      ))}
    </Stack>
  ), [filters, expandedSelects, filterValues, selectedListItems, handleDateChange, handleListItemToggle, toggleExpand, toggleListExpand]);

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
              onClear={handleClearSearch}
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
            {filtersList}
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