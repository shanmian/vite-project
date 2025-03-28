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
}) => (
  <TextField
    placeholder="Search Filter"
    variant="outlined"
    size="small"
    fullWidth
    value={value}
    autoComplete="off"
    name="filter-search"
    type="search"
    onKeyDown={onKeyDown}
    onChange={onChange}
    inputProps={{
      autoComplete: "off",
      form: {
        autoComplete: "off",
      },
    }}
    InputProps={{
      endAdornment: (
        <>
          {value ? (
            <InputAdornment position="end">
              <IconButton
                size="small"
                onClick={onClear}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ) : null}
          <InputAdornment position="end">
            <IconButton 
              size="small"
              color={value ? "primary" : "default"}
              onClick={onSearch}
            >
              <SearchIcon fontSize="small" />
            </IconButton>
          </InputAdornment>
        </>
      ),
    }}
  />
));

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
    handleListItemToggle(result.filterField, result.optionId);
    // 修改这里，将选中项的名称回显到搜索框
    setSearchValue(`${result.filterName}:${result.optionName}`);
    // 隐藏搜索结果
    setShowSearchResults(false);
    // 清空搜索结果数组，确保不会显示"NO result found"
    setSearchResults([]);
  };

  // 处理清除搜索框
  const handleClearSearch = () => {
    setSearchValue('');
    setShowSearchResults(false);
  };

  // 添加搜索处理函数
  const handleSearch = () => {
    if (searchValue && searchResults.length > 0) {
      // 点击搜索图标时只触发第一个搜索结果的选择，不展开列表
      const firstResult = searchResults[0];
      handleListItemToggle(firstResult.filterField, firstResult.optionId);
      
      // 设置搜索框的值为选中项的名称
      setSearchValue(firstResult.optionName);
      // 隐藏搜索结果
      setShowSearchResults(false);
      // 清空搜索结果数组，确保不会显示"NO result found"
      setSearchResults([]);
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
    if (!showSearchResults || searchValue.length === 0) return null;
    
    if (searchResults.length > 0) {
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
      );
    }
    
    return (
      <Paper 
        elevation={3} 
        sx={{ 
          mt: 1, 
          p: 2, 
          textAlign: 'center',
          position: 'absolute',
          width: 'calc(100% - 48px)',
          zIndex: 1000
        }}
      >
        <Typography variant="body2" color="text.secondary">
          NO result found
        </Typography>
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