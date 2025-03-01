// src/components/features/OrderStatusModal.tsx
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  SelectChangeEvent,
} from '@mui/material';
import { Order, OrderStatus } from '../../types';

interface OrderStatusModalProps {
  open: boolean;
  order: Order | null;
  onClose: () => void;
  onStatusChange: (status: OrderStatus) => void;
  isLoading: boolean;
}

const OrderStatusModal: React.FC<OrderStatusModalProps> = ({
  open,
  order,
  onClose,
  onStatusChange,
  isLoading,
}) => {
  const [status, setStatus] = React.useState<OrderStatus>('PENDING');

  // 選択されている注文が変更されたときにステータスを更新
  React.useEffect(() => {
    if (order) {
      setStatus(order.status);
    }
  }, [order]);

  const handleChange = (event: SelectChangeEvent) => {
    setStatus(event.target.value as OrderStatus);
  };

  const handleSubmit = () => {
    onStatusChange(status);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>ステータスを変更</DialogTitle>
      <DialogContent>
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel id="status-select-label">ステータス</InputLabel>
          <Select
            labelId="status-select-label"
            id="status-select"
            value={status}
            label="ステータス"
            onChange={handleChange}
          >
            <MenuItem value="PENDING">保留中</MenuItem>
            <MenuItem value="PROCESSING">処理中</MenuItem>
            <MenuItem value="COMPLETED">完了</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>キャンセル</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={isLoading || status === order?.status}
        >
          {isLoading ? <CircularProgress size={24} /> : '更新'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OrderStatusModal;