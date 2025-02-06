import { Test, TestingModule } from '@nestjs/testing';
import { CatController } from './cat.controller';
import { CatService } from './cat.service';
import { CatDTO } from './dto/cats.dto';
import { Cat } from './models/cats';

const testCat1 = 'Test Cat 1';
const testCat3 = 'Test Cat 3';

describe('Cat Controller', () => {
  let controller: CatController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CatController],
      providers: [
        {
          provide: CatService,
          useValue: {
            getAll: jest
              .fn()
              .mockReturnValue([
                new Cat(1, testCat1, 'Test Breed 1', 2),
                new Cat(2, 'Test Cat 2', 'Test Breed 2', 4),
              ]),
            getById: jest
              .fn()
              .mockReturnValue(new Cat(1, testCat1, 'Test Breed 1', 2)),
            addCat: jest
              .fn()
              .mockReturnValue(new Cat(3, testCat3, 'Test Breed 3', 5)),
            deleteCat: jest.fn().mockReturnValue(true),
            updateCat: jest
              .fn<CatDTO, [number, Partial<CatDTO>]>()
              .mockImplementation((id, updateCat) => ({
                ...new Cat(id, testCat1, 'Test Breed 1', 2),
                ...updateCat,
              })),
          },
        },
      ],
    }).compile();

    controller = module.get<CatController>(CatController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  describe('getAllCats', () => {
    it('should get the list of cats', () => {
      const retCats = controller.getAllCats();
      expect(typeof retCats).toBe('object');
      expect(retCats[0].id).toBe(1);
      expect(retCats[0].name).toBe('Test Cat 1');
      expect(retCats[1].name).toBe('Test Cat 2');
      expect(retCats[1].id).toBe(2);
      expect(retCats.length).toBe(2);
    });
  });
  describe('getCatById', () => {
    it('should get the cat matching the id', () => {
      const retCat = controller.getCatById(1);
      expect(typeof retCat).toBe('object');
      expect(retCat.id).toBe(1);
      expect(retCat.name).toBe(testCat1);
    });
  });
  describe('createNewCat', () => {
    it('should return a new cat', () => {
      const returnedCat = controller.createNewCat({
        age: 5,
        name: testCat3,
        breed: 'Test Breed 3',
      });
      expect(returnedCat.id).toBe(3);
      expect(returnedCat.name).toBe(testCat3);
    });
  });
  describe('deleteCat', () => {
    it('should return true that there was a deletion', () => {
      const delReturn = controller.deleteCat(2);
      expect(typeof delReturn).toBe('boolean');
      expect(delReturn);
    });
  });

  describe('updateCat', () => {
    const cat: Cat = { id: 1, name: testCat1, breed: 'Test Breed 1', age: 2 };

    it('should return cat when cat is updated', () => {
      const updatedCat = controller.updateCat(cat.id, {
        breed: 'Updated Breed',
        age: 4,
      });

      expect(updatedCat).toStrictEqual<Cat>({
        id: cat.id,
        name: cat.name,
        breed: 'Updated Breed',
        age: 4,
      });
    });
  });
});
