
import React, { useState } from 'react';
import { useAnimals } from '@/hooks/useAnimals';
import { useLanguage } from '@/contexts/LanguageContext';
import { Tables } from '@/integrations/supabase/types';
import AnimalProfile from '@/components/AnimalProfile';
import RegisterAnimalForm from '@/components/RegisterAnimalForm';
import AnimalCard from '@/components/AnimalCard';
import GeneralHerdSummary from '@/components/GeneralHerdSummary';
import RoleBasedAccess from '@/components/RoleBasedAccess';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

type Animal = Tables<'animals'>;

const AnimalDiary = () => {
  const { t } = useLanguage();
  const { user, loading: authLoading } = useAuth();
  const { data: animals = [], isLoading, error } = useAnimals();
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
  const [editingAnimal, setEditingAnimal] = useState<Animal | null>(null);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('individual');

  console.log('AnimalDiary render - authLoading:', authLoading, 'user:', !!user);

  // Redirect to auth if not authenticated
  // if (!authLoading && !user) {
  //   console.log('Redirecting to auth - no user');
  //   return <Navigate to="/auth" replace />;
  // }

  // // Show loading state while checking auth
  // if (authLoading) {
  //   console.log('Showing auth loading state');
  //   return (
  //     <div className="min-h-screen bg-gray-50 flex items-center justify-center">
  //       <div className="text-center">
  //         <div className="w-8 h-8 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
  //         <div className="text-gray-600">Loading...</div>
  //       </div>
  //     </div>
  //   );
  // }

  const filteredAnimals = animals.filter(animal =>
    animal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    animal.tag?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    animal.breed.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectAnimal = (animal: Animal) => {
    setSelectedAnimal(animal);
  };

  const handleEditAnimal = (animal: Animal) => {
    setEditingAnimal(animal);
    setShowRegisterForm(true);
  };

  const handleBackToList = () => {
    setSelectedAnimal(null);
    setEditingAnimal(null);
    setShowRegisterForm(false);
  };

  const handleAddAnimal = () => {
    setEditingAnimal(null);
    setShowRegisterForm(true);
  };

  const handleFormClose = () => {
    setShowRegisterForm(false);
    setEditingAnimal(null);
  };

  // Show animal profile
  if (selectedAnimal) {
    return (
      <AnimalProfile
        animal={selectedAnimal}
        onBack={handleBackToList}
        onEdit={() => handleEditAnimal(selectedAnimal)}
      />
    );
  }

  // Show register form
  if (showRegisterForm) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <PageHeader 
          title={editingAnimal ? t('editAnimal') : t('registerAnimal')} 
          onBack={handleBackToList} 
        />
        <div className="p-4">
          {/* <RoleBasedAccess allowedRoles={['owner', 'worker']}> */}
          <RegisterAnimalForm onClose={handleFormClose} />
          {/* </RoleBasedAccess> */}
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    console.error('AnimalDiary error:', error);
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <PageHeader title={t('animalDiary')} />
        <div className="p-4 max-w-6xl mx-auto">
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-red-600 mb-4">Error loading animals</div>
              <p className="text-gray-600 mb-4">Please try refreshing the page</p>
              <Button onClick={() => window.location.reload()}>
                Refresh Page
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  console.log('Rendering main AnimalDiary content');

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <PageHeader title={t('animalDiary')} />
      
      <div className="p-4 space-y-4 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2">
              {t('animalDiary')}
            </h1>
            <p className="text-gray-600 text-sm mt-1">Manage your dairy cows and herd</p>
          </div>
          {/* <RoleBasedAccess allowedRoles={['owner', 'worker']}> */}
          <Button onClick={handleAddAnimal} className="bg-green-600 hover:bg-green-700" size="sm">
            <Plus className="h-4 w-4 mr-1 md:mr-2" />
            {t('addAnimal')}
          </Button>
          {/* </RoleBasedAccess> */}
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="individual">Individual Cows</TabsTrigger>
            <TabsTrigger value="herd">Herd Summary</TabsTrigger>
          </TabsList>
          
          <TabsContent value="individual" className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name, tag, or breed..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="w-8 h-8 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
                  <div className="text-gray-600">{t('loading')}</div>
                </div>
              </div>
            )}

            {/* Animals Grid */}
            {!isLoading && (
              <>
                {filteredAnimals.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredAnimals.map((animal) => (
                      <AnimalCard
                        key={animal.id}
                        animal={animal}
                        onViewProfile={() => handleSelectAnimal(animal)}
                      />
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-6 md:p-12 text-center">
                      <div className="text-6xl mb-4"></div>
                      <h3 className="text-lg font-medium mb-2">
                        {animals.length === 0 ? 'No animals registered yet' : 'No animals found'}
                      </h3>
                      <p className="text-sm text-gray-500 mb-6">
                        {animals.length === 0 
                          ? 'Start by registering your first dairy cow to begin tracking.'
                          : 'Try adjusting your search terms to find the animals you\'re looking for.'
                        }
                      </p>
                      {animals.length === 0 && (
                        // <RoleBasedAccess allowedRoles={['owner', 'worker']}>
                        <Button onClick={handleAddAnimal} className="bg-green-600 hover:bg-green-700">
                          <Plus className="h-4 w-4 mr-2" />
                          Register Your First Cow
                        </Button>
                        // </RoleBasedAccess>
                      )}
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </TabsContent>
          
          <TabsContent value="herd" className="space-y-4">
            <GeneralHerdSummary />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AnimalDiary;
