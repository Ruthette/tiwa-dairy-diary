import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCreateFinancialRecord } from '@/hooks/useFinancialRecords';
import { useAnimals } from '@/hooks/useAnimals';

const FinanceForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    transaction_type: '',
    category: '',
    other_category: '', // 👈 new field
    amount: '',
    transaction_date: new Date().toISOString().split('T')[0],
    description: '',
    animal_id: '',
    supplier_name: '',
    supplier_contact: '',
    buyer_name: '',
    buyer_contact: '',
  });

  const { data: animals = [] } = useAnimals();
  const createRecord = useCreateFinancialRecord();

  const incomeCategories = [
    'Milk Sales',
    'Animal Sales',
    'Product Sales',
    'Services',
    'Other',
  ];

  const expenseCategories = [
    'Feed',
    'Medicine',
    'Veterinary Services',
    'Equipment',
    'Labor',
    'Transport',
    'Other',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const finalCategory =
        formData.category === 'Other' ? formData.other_category : formData.category;

      await createRecord.mutateAsync({
        transaction_type: formData.transaction_type,
        category: finalCategory,
        amount: Math.round(parseFloat(formData.amount) || 0),
        transaction_date: formData.transaction_date,
        description: formData.description || null,
        animal_id:
          formData.animal_id === 'none' ? null : formData.animal_id || null,
        supplier_name: formData.supplier_name || null,
        supplier_contact: formData.supplier_contact || null,
        buyer_name: formData.buyer_name || null,
        buyer_contact: formData.buyer_contact || null,
      });

      navigate('/finances');
    } catch (error) {
      console.error('Error creating financial record:', error);
    }
  };

  const categories =
    formData.transaction_type === 'Income'
      ? incomeCategories
      : expenseCategories;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="p-4 max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/finances')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Add Financial Record</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Financial Record Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="transaction_type">Transaction Type *</Label>
                  <Select
                    value={formData.transaction_type}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        transaction_type: value,
                        category: '',
                        other_category: '',
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Income">💰 Income</SelectItem>
                      <SelectItem value="Expense">💸 Expense</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        category: value,
                        other_category: '',
                      }))
                    }
                    disabled={!formData.transaction_type}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* 👇 Show input if "Other" is chosen */}
              {formData.category === 'Other' && (
                <div className="space-y-2">
                  <Label htmlFor="other_category">Specify Category *</Label>
                  <Input
                    id="other_category"
                    value={formData.other_category}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        other_category: e.target.value,
                      }))
                    }
                    placeholder="Enter category"
                    required
                  />
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (KSh) *</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={formData.amount}
                    onChange={(e) => {
                      const value = Math.round(
                        parseFloat(e.target.value) || 0
                      ).toString();
                      setFormData((prev) => ({ ...prev, amount: value }));
                    }}
                    placeholder="0"
                    required
                    min="0"
                    step="1"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="transaction_date">Date *</Label>
                  <Input
                    id="transaction_date"
                    type="date"
                    value={formData.transaction_date}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        transaction_date: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="animal_id">Related Animal (Optional)</Label>
                <Select
                  value={formData.animal_id}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, animal_id: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an animal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No specific animal</SelectItem>
                    {animals.map((animal) => (
                      <SelectItem key={animal.id} value={animal.id}>
                        {animal.name} {animal.tag ? `(${animal.tag})` : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {formData.transaction_type === 'Expense' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="supplier_name">Supplier Name</Label>
                    <Input
                      id="supplier_name"
                      value={formData.supplier_name}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          supplier_name: e.target.value,
                        }))
                      }
                      placeholder="Supplier name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="supplier_contact">Supplier Contact</Label>
                    <Input
                      id="supplier_contact"
                      value={formData.supplier_contact}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          supplier_contact: e.target.value,
                        }))
                      }
                      placeholder="Phone or email"
                    />
                  </div>
                </div>
              )}

              {formData.transaction_type === 'Income' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="buyer_name">Buyer Name</Label>
                    <Input
                      id="buyer_name"
                      value={formData.buyer_name}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          buyer_name: e.target.value,
                        }))
                      }
                      placeholder="Buyer name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="buyer_contact">Buyer Contact</Label>
                    <Input
                      id="buyer_contact"
                      value={formData.buyer_contact}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          buyer_contact: e.target.value,
                        }))
                      }
                      placeholder="Phone or email"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Additional details..."
                  rows={3}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={createRecord.isPending}
                >
                  Save Record
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/finances')}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FinanceForm;
