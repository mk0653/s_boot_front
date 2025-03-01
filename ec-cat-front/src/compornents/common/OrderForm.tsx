import React from 'react';
import { useQueryClient, useMutation } from 'react-query';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  CircularProgress,
} from '@mui/material';
import { createOrder } from '../../api/orderApi';
import { Order } from '../../types';

interface OrderFormProps {
  open: boolean;
  order: Order | null;
  onClose: () => void;
}

// バリデーションスキーマ
const validationSchema = Yup.object({
  customerName: Yup.string().required('顧客名は必須です'),
  productName: Yup.string().required('商品名は必須です'),
  quantity: Yup.number()
    .required('数量は必須です')
    .positive('数量は正の数である必要があります')
    .integer('数量は整数である必要があります'),
});

const OrderForm: React.FC<OrderFormProps> = ({ open, order, onClose }) => {
  const queryClient = useQueryClient();
  const isEditMode = Boolean(order);

  // 注文作成のミューテーション
  const mutation = useMutation(
    (values: { customerName: string; productName: string; quantity: number }) =>
      createOrder(values),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('orders');
        onClose();
      },
    }
  );

  // Formikの設定
  const formik = useFormik({
    initialValues: {
      customerName: order?.customerName || '',
      productName: order?.productName || '',
      quantity: order?.quantity || 1,
    },
    validationSchema,
    onSubmit: (values) => {
      mutation.mutate(values);
    },
    enableReinitialize: true,
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEditMode ? '注文を編集' : '新規注文を作成'}</DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, my: 1 }}>
            <TextField
              fullWidth
              id="customerName"
              name="customerName"
              label="顧客名"
              value={formik.values.customerName}
              onChange={formik.handleChange}
              error={formik.touched.customerName && Boolean(formik.errors.customerName)}
              helperText={formik.touched.customerName && formik.errors.customerName}
            />
            <TextField
              fullWidth
              id="productName"
              name="productName"
              label="商品名"
              value={formik.values.productName}
              onChange={formik.handleChange}
              error={formik.touched.productName && Boolean(formik.errors.productName)}
              helperText={formik.touched.productName && formik.errors.productName}
            />
            <TextField
              fullWidth
              id="quantity"
              name="quantity"
              label="数量"
              type="number"
              value={formik.values.quantity}
              onChange={formik.handleChange}
              error={formik.touched.quantity && Boolean(formik.errors.quantity)}
              helperText={formik.touched.quantity && formik.errors.quantity}
              inputProps={{ min: 1 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>キャンセル</Button>
          <Button
            type="submit"
            variant="contained"
            disabled={mutation.isLoading || !formik.isValid}
          >
            {mutation.isLoading ? (
              <CircularProgress size={24} />
            ) : isEditMode ? (
              '更新'
            ) : (
              '作成'
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default OrderForm;