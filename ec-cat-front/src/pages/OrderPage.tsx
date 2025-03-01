import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
  Box,
  Typography,
  Button,
  Paper,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { fetchOrders, deleteOrder, updateOrderStatus } from '../api/orderApi';
import { Order, OrderStatus } from '../types';
import OrderForm from '../components/common/OrderForm';
import DeleteConfirmation from '../components/common/DeleteConfirmation';
import OrderStatusModal from '../components/common/OrderStatusModal';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`orders-tabpanel-${index}`}
      aria-labelledby={`orders-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `orders-tab-${index}`,
    'aria-controls': `orders-tabpanel-${index}`,
  };
}

const OrdersPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [tabValue, setTabValue] = useState(0);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Fetch orders
  const { data, isLoading, isError } = useQuery('orders', fetchOrders);

  // Delete order mutation
  const deleteMutation = useMutation(
    (id: number) => deleteOrder(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('orders');
      },
    }
  );

  // Update status mutation
  const updateStatusMutation = useMutation(
    ({ id, status }: { id: number; status: OrderStatus }) => updateOrderStatus(id, status),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('orders');
      },
    }
  );

  // Filter orders based on tab
  const getFilteredOrders = () => {
    if (!data || !data.success || !data.data) return [];
    
    const orders = data.data;
    switch (tabValue) {
      case 0: // All
        return orders;
      case 1: // Pending
        return orders.filter(order => order.status === 'PENDING');
      case 2: // Processing
        return orders.filter(order => order.status === 'PROCESSING');
      case 3: // Completed
        return orders.filter(order => order.status === 'COMPLETED');
      default:
        return orders;
    }
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleAddClick = () => {
    setSelectedOrder(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (order: Order) => {
    setSelectedOrder(order);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (order: Order) => {
    setSelectedOrder(order);
    setIsDeleteModalOpen(true);
  };

  const handleStatusClick = (order: Order) => {
    setSelectedOrder(order);
    setIsStatusModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedOrder) {
      deleteMutation.mutate(selectedOrder.id);
      setIsDeleteModalOpen(false);
    }
  };

  const handleStatusChange = (status: OrderStatus) => {
    if (selectedOrder) {
      updateStatusMutation.mutate({ id: selectedOrder.id, status });
      setIsStatusModalOpen(false);
    }
  };

  const getStatusChipColor = (status: OrderStatus) => {
    switch (status) {
      case 'PENDING':
        return 'warning';
      case 'PROCESSING':
        return 'info';
      case 'COMPLETED':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Orders
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAddClick}
        >
          New Order
        </Button>
      </Box>

      <Paper sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="order tabs">
            <Tab label="All Orders" {...a11yProps(0)} />
            <Tab label="Pending" {...a11yProps(1)} />
            <Tab label="Processing" {...a11yProps(2)} />
            <Tab label="Completed" {...a11yProps(3)} />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={tabValue}>
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : isError ? (
            <Alert severity="error">Failed to load orders. Please try again later.</Alert>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Order ID</TableCell>
                    <TableCell>Customer Name</TableCell>
                    <TableCell>Product Name</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {getFilteredOrders().map((order) => (
                    <TableRow key={order.id} hover>
                      <TableCell>#{order.id}</TableCell>
                      <TableCell>{order.customerName}</TableCell>
                      <TableCell>{order.productName}</TableCell>
                      <TableCell>{order.quantity}</TableCell>
                      <TableCell>
                        <Chip
                          label={order.status}
                          color={getStatusChipColor(order.status)}
                          size="small"
                          onClick={() => handleStatusClick(order)}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          color="primary"
                          size="small"
                          onClick={() => handleEditClick(order)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          size="small"
                          onClick={() => handleDeleteClick(order)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                  {getFilteredOrders().length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        No orders found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </TabPanel>
      </Paper>

      {/* Order Form Modal */}
      <OrderForm
        open={isFormOpen}
        order={selectedOrder}
        onClose={() => setIsFormOpen(false)}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmation
        open={isDeleteModalOpen}
        title="Delete Order"
        content={`Are you sure you want to delete order #${selectedOrder?.id}?`}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        isLoading={deleteMutation.isLoading}
      />

      {/* Status Change Modal */}
      <OrderStatusModal
        open={isStatusModalOpen}
        order={selectedOrder}
        onClose={() => setIsStatusModalOpen(false)}
        onStatusChange={handleStatusChange}
        isLoading={updateStatusMutation.isLoading}
      />
    </Box>
  );
};

export default OrdersPage;