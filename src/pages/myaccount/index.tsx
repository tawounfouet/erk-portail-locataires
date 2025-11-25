import { useState } from 'react';
import { User, ChevronRight, Mail, Phone, Edit2, Check, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';


export default function MyAccountPage()
{
    const { user } = useAuth();

    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({...user});


    const handleEdit = () => {
        setIsEditing(true);
        setEditData({...user});
    };

    const handleSave = () => {
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditData({...user});
        setIsEditing(false);
    };

    if (!user)
    {
        return (
            <div>
                Utilisateur non connecté
            </div>
        );
    }

    return (
    <div className="space-y-6">
		<div className="mb-6 mt-2">
			<h2 className="text-3xl font-bold text-white tracking-tight">Mon compte</h2>
			<p className="text-gray-400 mt-1">Gérez vos informations personnelles</p>
		</div>
		
		<div className="flex items-center justify-end">
			{!isEditing ? (
				<Button onClick={handleEdit} className="gap-2 shadow-md shadom-primary/20">
					<Edit2 className="w-4 h-4" />
					Modifier
				</Button>
				) : (
				<div className="flex gap-2">
					<Button onClick={handleSave} className="gap-2 bg-green-600 hover:bg-green-700">
						<Check className="w-4 h-4" />
						Enregistrer
					</Button>
					<Button onClick={handleCancel} variant="outline" className="gap-2 text-white">
						<X className="w-4 h-4" />
						Annuler
					</Button>
				</div>
			)}
		</div>

		<div className="bg-gray-500/50 rounded-xl">
			<CardHeader>
				<div className="flex items-center gap-4">
				<div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-500 to-primary-600 flex items-center justify-center text-white text-2xl font-bold">
					{user.full_name.split(' ').map(n => n[0]).join('')}
				</div>
				<div>
					<CardTitle className="text-2xl">{user.full_name}</CardTitle>
					<CardDescription className="text-black">{user.email}</CardDescription>
				</div>
				</div>
			</CardHeader>
			
			<CardContent className="space-y-4">
				<div className="grid gap-4">
				<div className="space-y-2">
					<Label htmlFor="name" className="flex items-center gap-2 text-gray-200">
					<User className="w-4 h-4" />
					Nom complet
					</Label>
					<Input
					id="name"
					value={user.full_name}
					disabled={true}
					className="w-full h-12 bg-[#2f2014] border border-white/10 rounded-full p-4 text-white placeholder:text-white-600 placeholder:text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="email" className="flex items-center gap-2 text-gray-200">
					<Mail className="w-4 h-4" />
					Email
					</Label>
					<Input
					id="email"
					type="email"
					value={user.email}
					disabled={true}
					className="w-full h-12 bg-[#2f2014] border border-white/10 rounded-full p-4 text-white placeholder:text-white-600 placeholder:text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="phone" className="flex items-center gap-2 text-gray-200">
					<Phone className="w-4 h-4" />
					Téléphone
					</Label>
					<Input
					id="phone"
					value={isEditing ? editData.phone : user.phone}
					onChange={(e) => setEditData({...editData, phone: e.target.value})}
					disabled={!isEditing}
					className={`
							w-full h-12 border border-white/10 rounded-full p-4 text-white placeholder:text-white-600 placeholder:text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all
							${!isEditing ? 'bg-[#2f2014]' : 'bg-[#2f2014]/80'}
						`}
					/>
				</div>

				{/* <div className="space-y-2">
					<Label htmlFor="address" className="flex items-center gap-2">
					<MapPin className="w-4 h-4" />
					Adresse
					</Label>
					<Input
					id="address"
					value={isEditing ? editData.address : user.address}
					onChange={(e) => setEditData({...editData, address: e.target.value})}
					disabled={!isEditing}
					className={!isEditing ? 'bg-gray-50' : ''}
					/>
				</div> */}
				</div>
			</CardContent>
		</div>

      {/* <Card>
        <CardHeader>
          <CardTitle>Sécurité</CardTitle>
          <CardDescription>Gérez vos paramètres de sécurité</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-between">
            Changer le mot de passe
            <ChevronRight className="w-4 h-4" />
          </Button>
          <Button variant="outline" className="w-full justify-between">
            Authentification à deux facteurs
            <ChevronRight className="w-4 h-4" />
          </Button>
        </CardContent>
      </Card> */}
    </div>
  );
}